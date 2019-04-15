#!/usr/bin/env python
# coding=utf-8

import hashlib
import os
import sys
import shutil


def get_file_md5(filename):
    if not os.path.isfile(filename):
        return
    myhash = hashlib.md5()
    f = file(filename, 'rb')
    while True:
        b = f.read(8096)
        if not b:
            break
        myhash.update(b)
    f.close()
    return myhash.hexdigest()


if __name__ == '__main__':
    if len(sys.argv) != 5:
        print("Usage:\n\t" + sys.argv[0] + " <last_version_dir> <current_version_dir> <group_index> <asset_start_index>")
        exit(1)
    if not os.path.exists(sys.argv[1]):
        print("ERROR: last version directory \"" + sys.argv[1] + "\" does NOT exist.")
    if not os.path.exists(sys.argv[2]):
        print("ERROR: current version directory \"" + sys.argv[2] + "\" does NOT exist.")
    last_dir = os.path.abspath(sys.argv[1])
    current_dir = os.path.abspath(sys.argv[2])
    target_dir = os.path.abspath("hotfix_dir")
    group_idx = int(sys.argv[3])
    asset_start_idx = int(sys.argv[4])
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.mkdir(target_dir)
    for dirpath, dirnames, filenames in os.walk(current_dir):
        for filename in filenames:
            new_file = dirpath + os.sep + filename
            suffix = new_file[len(current_dir):]
            last_file = last_dir + suffix
            if not os.path.exists(last_file) or get_file_md5(new_file) != get_file_md5(last_file):
                target_file = target_dir + suffix
                if not os.path.exists(os.path.dirname(target_dir + suffix)):
                    os.makedirs(os.path.dirname(target_dir + suffix))
                shutil.copyfile(new_file, target_file)
                print("""
        "update%d" : {
            "path" : "%s",
            "md5" : "%s",
            "group" : "%d"
        },""" % (asset_start_idx, suffix[1:], get_file_md5(new_file), group_idx))
                asset_start_idx += 1
    print("\n!!!JSON最后不要有逗号!!!")
