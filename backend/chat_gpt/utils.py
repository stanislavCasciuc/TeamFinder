from openai import AzureOpenAI
import os


async def get_chat_gpt_response(content: str, message: str):
    # client = AzureOpenAI(
    #     api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    #     api_version="2023-05-15",
    #     azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    # )
    client = AzureOpenAI(
        api_key="4de2c734d831446898e94312cd463c80",
        api_version="2023-05-15",
        azure_endpoint="https://atc-2024-openai.openai.azure.com/"
    )

    response = client.chat.completions.create(
        model="atc-2024-gpt-35-turbo",
        messages=[
            {
                "role": "user",
                "content": f"Please create a team using the provided data. Your response should include a list of users. Each user should be represented as a dictionary with the following fields: name, skills, role, and hours_per_day. Ensure that the team composition aligns with the specified skills and roles, and that daily work hours do not exceed 8 hours. Additionally, please include the project start date. The length of the members of team should match the number of roles provided. If you are unable to fill all roles, create the team with the available users. Provided data: \n\n {content}  \n\nMessage: {message}  \n\nMark message could be empty"
            }
        ]
    )

    return response.choices[0].message.content
