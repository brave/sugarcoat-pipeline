import os
import string
import random

resources_dir = './resources'

def get_file_size_chars(target):
    files_size_chars = []
    for root, _, files in os.walk(target):
        for name in files:
            # Construct absolute path for files
            filename = os.path.join(root, name)
            # File size information in bytes                  
            f = open(filename, "r")
            chars = len(f.read())
            size = os.path.getsize(filename)
            files_size_chars.append((filename, size, chars))
    return files_size_chars

files = get_file_size_chars(resources_dir)
max_size_file = max(files, key=lambda x: x[1])
print(f'Max char count of file in {resources_dir} is file {max_size_file[0]} with {max_size_file[1]} and chars {max_size_file[2]}')

def generate_random_chars(chars, N):
    return ''.join(random.choice(chars) for _ in range(N))

def pad(filename, to_pad):
    # generate a comment string with to_pad number of chars
    # \n/**/ is 5 extra chars
    size_of_comment_string = to_pad - 5
    print(f'Length of comment string required for {filename}: {size_of_comment_string}')
    if size_of_comment_string <= 0:
        return
    comment_string = f'\n/*{generate_random_chars(string.ascii_lowercase + string.digits, size_of_comment_string)}*/'
    with open(filename, "a") as script:
        script.write(comment_string)


for f, _, chars in files:
    pad(f, max_size_file[2] - chars)

new_files = get_file_size_chars(resources_dir)
for f, size, _ in new_files:
    print(f'File {f} now has size {size} bytes')
