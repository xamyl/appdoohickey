import os
import json
import requests
import sys

def handle_pull_request(payload):
    """handles a pull request"""

    pr = payload['pull_request']
    pr_number = pr['number']
    pr_body = pr['body']
    repo_owner = "xamyl"
    repo_name = "appdoohickey"
    app_data = extract_app_data(pr_body)

    if app_data:
        try:
            validate_app_data(app_data)

            apps_data = get_apps_json(repo_owner, repo_name)

            apps_data.append(app_data)

            update_apps_json(repo_owner, repo_name, apps_data, pr_number, pr['head']['ref'])

            print(f"App data added to apps.json from PR #{pr_number}")
        except ValueError as e:
            print(f"Error processing PR #{pr_number}: {e}")
            add_pr_comment(repo_owner, repo_name, pr_number, f"Error: {e}. Please correct the app data.")

    else:
        print(f"No valid app data found in PR #{pr_number}")
        add_pr_comment(repo_owner, repo_name, pr_number, "Please include app data in JSON format within triple backticks (```json ... ```) in the PR description.")



def extract_app_data(pr_body):
    """Extracts app data from the PR body if it matches the expected syntax."""
    start_marker = "```json"
    end_marker = "```"

    start_index = pr_body.find(start_marker)
    if start_index == -1:
        return None

    start_index += len(start_marker)
    end_index = pr_body.find(end_marker, start_index)
    if end_index == -1:
        return None

    json_string = pr_body[start_index:end_index].strip()
    try:
        return json.loads(json_string)
    except json.JSONDecodeError:
        return None

def validate_app_data(app_data):
    """Validates the structure and required fields of the app data."""
    required_fields = ["name", "description", "developer", "longDescription", "downloadUrl", "version", "releaseDate", "size", "requirements", "features"]
    for field in required_fields:
        if field not in app_data:
            raise ValueError(f"Missing required field: {field}")

    if "developer" not in app_data or "name" not in app_data["developer"] or "url" not in app_data["developer"] or "avatar" not in app_data["developer"]:
        raise ValueError("Developer object is missing required fields.")

    if not isinstance(app_data.get("features",), list):
        raise ValueError("Features must be a list.")

    if "screenshots" in app_data and not isinstance(app_data["screenshots"], list):
        raise ValueError("Screenshots must be a list.")

def get_apps_json(repo_owner, repo_name):
    """Retrieves the current apps.json content from the repository."""
    try:
      with open("apps.json", "r") as f:
          return json.load(f)
    except FileNotFoundError:
      return []
    except json.JSONDecodeError:
      return []

def update_apps_json(repo_owner, repo_name, apps_data, pr_number, branch):
    """Updates the apps.json file in the repository."""
    with open("apps.json", "w") as f:
        json.dump(apps_data, f, indent=2)
    os.system("git config --global user.email 'actions@github.com'")
    os.system("git config --global user.name 'GitHub Actions'")
    os.system("git add apps.json")
    os.system(f"git commit -m 'Update apps.json from PR #{pr_number}'")
    os.system(f"git push origin HEAD:{branch}")

def add_pr_comment(repo_owner, repo_name, pr_number, comment):
    """Adds a comment to the pull request."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{pr_number}/comments"
    headers = {
        "Authorization": f"token {os.environ.get('GITHUB_TOKEN')}",
        "Content-Type": "application/json",
    }
    data = {"body": comment}
    response = requests.post(url, headers=headers, json=data)
    if response.status_code != 201:
        print(f"Failed to add comment: {response.status_code} - {response.text}")

    return response

payload = json.loads(sys.argv[1])
handle_pull_request(payload)

