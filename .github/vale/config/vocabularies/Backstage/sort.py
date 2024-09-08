def sort_words_in_file(input_file, output_file):
    with open(input_file, 'r') as file:
        words = file.read().splitlines()

    sorted_words = sorted(words, key=str.lower)

    with open(output_file, 'w') as file:
        for word in sorted_words:
            file.write(word + '\n')

if __name__ == "__main__":
    input_file = 'accept.txt'
    output_file = 'accept.txt'
    sort_words_in_file(input_file, output_file)
