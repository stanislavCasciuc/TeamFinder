from openai import AzureOpenAI
import os


async def get_chat_gpt_response(content: str):
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2023-05-15",
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

    response = client.chat.completions.create(
        model="atc-2024-gpt-35-turbo",
        messages=[
            {"role": "system",
             "content": "Create a team with following data.Your response will be a list of users. User will be a dictionary with name, skills, role,and hours_per_day. Create a team with following information. Ensure that the team has the right skills and roles and that hours_per_day are not exceeded."},
            {"role": "user", "content": content}
        ]
    )

    return response.choices[0].message.content
