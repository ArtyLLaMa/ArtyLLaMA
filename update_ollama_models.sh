#!/bin/bash
# update_llm.sh

# Retrieves the list of LLMs installed in the Docker container
llm_list=$(ollama list | tail -n +2 | awk '{print $1}')

# Loop over each LLM to update it
for llm in $llm_list; do
  ollama pull $llm
done
