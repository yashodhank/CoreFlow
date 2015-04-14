# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
import os

version = '0.0.1'

setup(
    name='coreflow',
    version=version,
    description='Worflows with super powers',
    author='MaxMorais',
    author_email='max.morais.dmm@gmail.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=("frappe",),
)
