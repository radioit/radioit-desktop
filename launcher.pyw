#!/usr/bin/env python
# _*_ coding: utf-8 _*_

import json
import os
import subprocess

with open("launcher.config") as f:
    data = json.load(f)
    try:
        subprocess.Popen(os.path.abspath(data["pathToElectron"]) + " " + os.path.abspath(data["entry"]), shell=False)
    except Exception, e:
        pass