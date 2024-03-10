import spacy

# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")

def is_matching_technology(skill_name, skill_description, technology_name):
    # Tokenize the skill name and description
    skill_tokens = nlp(skill_name + " " + skill_description)

    # Tokenize the technology name
    technology_tokens = nlp(technology_name)

    # Calculate similarity between skill and technology
    similarity = skill_tokens.similarity(technology_tokens)

    # You can adjust the similarity threshold based on your needs
    similarity_threshold = 0.7

    return similarity > similarity_threshold