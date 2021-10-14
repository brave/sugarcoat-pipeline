import re
import os
import shutil
from distutils.dir_util import copy_tree
import hashlib
import fileinput
import tldextract
from shutil import copyfile, rmtree

# In this script we:
# - rewrite the resource name to just be the hash
# - fix up the rules accordingly
# - change redirect -> redirect-url with the right URL prefix
# In the future, we can just fix the sugarcoat pipeline to do this for us (that would require a re-crawl)

destdir_resources = './resources'
dest_rules = './brave-sugarcoat.txt'
rootdir = '../folders/oct-13'
sugarcoat_scripts_dir = 'sugarcoat_scripts'
sugarcoat_rules_file = 'sugarcoat_rules.txt'
new_sugarcoat_rules_file = 'new-sugarcoat_rules.txt'
redirect_sugarcoat_substring = 'redirect='
redirect_url_sugarcoat_substring = 'redirect-url=https://pcdn.brave.com/sugarcoat/'
domain_substring = 'domain='

# Delete the resources/ directory if it exists, and create new (fresh start everytime)
if os.path.exists(destdir_resources):
    shutil.rmtree(destdir_resources)
os.makedirs(destdir_resources)

new_rules = []
for example in os.listdir(rootdir):
    if not os.path.isdir(os.path.join(rootdir, example)):
        continue
    # get domain to use in new filter rule
    extract_result = tldextract.extract(example)
    domain = extract_result.domain + '.' + extract_result.suffix    

    scripts_dir = os.path.join(rootdir, example, sugarcoat_scripts_dir)
    rules_file = os.path.join(rootdir, example, sugarcoat_rules_file)
    #new_rules_file = os.path.join(rootdir, example, new_sugarcoat_rules_file)
    # read rules file, get resource name from end of rule, get hash of file, append to list of new rules and write that out 
    # to a new file
    with open(rules_file, 'r+') as f:
        for rule in f:
            # get resource name from rule
            resource_name = rule[rule.find(redirect_sugarcoat_substring) + len(redirect_sugarcoat_substring):].strip()
            file_path = os.path.join(scripts_dir, f'{resource_name}.js')
            file_hash = hashlib.md5(open(file_path, 'rb').read().strip()).hexdigest()
            new_resource_name = f'sugarcoat-{file_hash}.js'            
            new_file_path = os.path.join(destdir_resources, new_resource_name)
            new_rule = rule[:rule.find(redirect_sugarcoat_substring)] + f'{domain_substring}{domain},{redirect_url_sugarcoat_substring}{new_resource_name}'
            new_rules.append(new_rule)
            # copy the old file to the new path file_path -> new_file_path
            copyfile(file_path, new_file_path)

with open(dest_rules, 'w') as f:
    f.write('\n'.join(new_rules))

