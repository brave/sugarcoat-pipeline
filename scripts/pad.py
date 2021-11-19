import os
import string
import random
import argparse
import logging 
from shutil import copyfile

# Instantiate the parser
parser = argparse.ArgumentParser()

'''
pad.py <path> <output> <size-of-bucket>

This script divides up the files in path into buckets of size >= N
that have smallest possible size and pads with a comment.

- Sort files in decreasing order.
- Divide into bins of size N by size. 
- If left over, put all leftovers into previous bin.
- For each bucket, pad to largest size.
'''

parser.add_argument('-r', '--resources', type=str, required=True,
                    help='Path to input directory which contains all resources')
parser.add_argument('-o', '--output', type=str, required=False,
                    help='Output directory for padded scripts. Default: resources')   
parser.add_argument('-b', '--bucket', type=int, required=False,
                    help='Bucket size. Default is <number-of-resources>')                    
args = parser.parse_args()

if not args.resources:
    parser.error("`--resources` has to be specified")

if not args.output:
    args.output = args.resources

resources_dir = args.resources
bucket_size = args.bucket
output = args.output

if not os.path.isdir(output):
    parser.error(f'Output directory {output} does not exist')
if not os.path.isdir(resources_dir):
    parser.error(f'Resources directory {resources_dir} does not exist')

def generate_random_chars(chars, N):
    return ''.join(random.choice(chars) for _ in range(N))

def pad(filename, chars, max_size):
    new_script_name = os.path.join(output, os.path.basename(filename))
    to_pad = max_size - chars
    # generate a comment string with to_pad number of chars
    # \n/**/ is 5 extra chars
    size_of_comment_string = to_pad - 5
    if size_of_comment_string <= 0:
        copyfile(filename, new_script_name)
        return
    inflation = (to_pad / chars) * 100
    logging.debug(f'Length of comment string required for {filename}: {size_of_comment_string}. Inflating number of chars by: {inflation}%')
    comment_string = f'\n/*{generate_random_chars(string.ascii_lowercase + string.digits, size_of_comment_string)}*/'
    copyfile(filename, new_script_name)
    with open(new_script_name, "a") as script:
        script.write(comment_string)


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

if not bucket_size or bucket_size <= 0:
    print(f"Setting bucket size to be {len(files)}")
    bucket_size = len(files)
if bucket_size > len(files):
    print(f"Bucket size {bucket_size} is greater than total number of files in {resources_dir}, setting bucket size to be {len(files)}")
    bucket_size = len(files)

for f, size, _ in files:
    print(f'File {f} has size {size} bytes')

# Sort files by size, decreasing
files.sort(key=lambda x : x[1], reverse=True)

i = 0
cur_max = 0
while i < len(files):
    if i + bucket_size <= len(files):
        logging.debug(f'Bucket size is {bucket_size - i}')
        max_file = files[i]
        cur_max = max_file[2]
        for file in files[i : i + bucket_size]:
            pad(file[0], file[2], cur_max)
        i += bucket_size
    else:
        # for left over elements, add to previous bucket
        # increase by previous max
        pad(files[i][0], files[i][2], cur_max)
        i += 1

# Post        
new_files = get_file_size_chars(output)
for f, size, _ in new_files:
    print(f'File {f} now has size {size} bytes')