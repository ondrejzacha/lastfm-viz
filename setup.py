from setuptools import setup, find_packages


base_packages = [
    "numpy",
    "pandas", 'requests'
]

dev_packages = ["jupyterlab", "mypy", "flake8"]


setup(
    name="lastfm",
    version='1.0.0',
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=base_packages,
    description="",
    extras_require={
        'dev': dev_packages
    },
    # entry_points={"console_scripts": ["my_command = app.cli:main"]},
    author="Ondrej",
    long_description_content_type="text/markdown",
)