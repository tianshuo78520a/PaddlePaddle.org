# PaddlePaddle.org Development Guide

Welcome to PaddlePaddle.org (PPO) development guide.  This guide is intended for developers of the PaddlePaddle.org website, and will cover how to setup a development environment for PPO, how to submit code to Github, and finally how to test your changes on the testing environments.

## Technology

This website is built using the Python framework [Django](https://www.djangoproject.com/) (1.8.11) and [Skeleton](http://getskeleton.com/). All the content is served from built assets, and as a result, the website setup does not require any database infrastructure.

The webserver running the site is Gunicorn tied with [Nginx](https://www.nginx.com/). We use a Docker container to deploy it to a public cloud.


## Installation

Please see [the main README](README.md) to setup your environment for building documentation.

The only thing that guide does not cover is to make your development environment ready for changing the styling of the website. The site uses SASS to build CSS, and to do this, it depends on **compass**, a Ruby tool tool that converts SASS to CSS.

First, find a way to install Ruby on your machine (or Docker instance, if you are running this in Docker). Then run:

```bash
gem update --system
gem install compass

# To run compass, navigate to the static directory and run it.
cd static
compass watch
```


## How content is generated and published

Upon merge to the `develop` branch of the `FluidDoc`, a continuous integration server pulls in the PaddlePaddle.org repo and executes the script `scripts/deploy/deploy_docs.sh` (includes all the environment variables and arguments it expects the continuous integration tool to provide). This produces the content which can be rendered on the website, and thus this generated HTML output needs to be published onto the website.

And thus, this HTML is transferred (using rsync) to the server running the website.


### Git branching

PaddlePaddle.org utilizes a branching model focusing on two main branches, **develop** and **master**. `FluidDoc`'s `develop` branch pulls in the PaddlePaddle.org's **master** branch

- **develop**:  Default branch that contains all the latest development code slated for the next release of the product.
- **master**: The main branch that contains the latest production ready release of the product.

This model also utilizes a few supporting branches:

- **feature**:  Feature branches typically resides within a developer's fork and are branched off of *develop* branch.  These branches are used during development of new features and when completed are merged into origin/develop.  They can be named anything except for master, develop, release-\*, or hotfix-\*
- **release**:  When a PaddlePaddle.org is ready for a new release, a developer would create a release branch off of *develop* branch.  No major code changes should occur on this branch.  However minor bug fixes are allowed.  After the release is ready, this branch is merged into *master* (and tagged), at which point the branch will be removed.   
- **hotfix**:  Used to fix critical production issues.  Typically this branch would be created off of *master* brach, and then merged back into *master* and *develop* once the hotfix is complete

Please visit [A successful git branching model](http://nvie.com/posts/a-successful-git-branching-model/) for more details on this structure.


### Submitting a pull request

For a new feature or bug fix, you are invited to create a new feature branch, and submit it using a Pull Request, where in a repo maintainer will review your changes.


## Testing Environments & Deployment

PaddlePaddle.org utilizes Travis-CI to provide for a continuous integration testing environment with every code checking.  PaddlePaddle.org monitors three branches:

- **develop**:  Checkin to this branch will deploy PaddlePaddle.org to the development environment at [http://staging.paddlepaddle.org:82](http://staging.paddlepaddle.org:82)
- **release-&ast;**:  Checkin to this branch will deploy PaddlePaddle.org to the staging environment at [http://staging.paddlepaddle.org](http://staging.paddlepaddle.org)
- **master**:  Checkin to this branch will deploy PaddlePaddle.org to the production environment at [http://www.paddlepaddle.org](http://www.paddlepaddle.org)


### Production environment

The production server for PaddlePaddle.org is an AWS-Asia-hosted Ubuntu 16.04 server running the website in a Docker instance, which can be scaled using AWS's load balancer as per need and traffic. Content is deployed into a persistent block storage volume that gets "mounted" to the Docker instance (through the VM), and updated through the a VM mount during continuous integration builds.

### Continuous integration

As stated above, PaddlePaddle.org is continuously deployed through the Travis CI service. See [the config](.travis.yml) for more details.

Apart from continuously integrating the website, this repository also plays a key role in the process of deployment of individual content repos. A high-level overview of this process of deployment looks like this:

(**NOTE**: The graphic below is erroneous in one way. Instead of building on changes on every individual repo, something that used to be the case earlier, we now only look for changes on the consolidated `FluidDoc` repo)

![Development contribution](assets/building-deploying-paddlepaddle-prod.org.png)

The PaddlePaddle.org repository is pulled and invoked through the management command `deploy_documentation` with inputs of source directory, version, and language. Read the `.travis.yml` configurations on each content repo to see when and how this process in involved.


### Contributing content

We invite contributions to both the codebase of PaddlePaddle.org and the `FluidDoc` repo.

Note that if you decide to change the structure of the content repos alone, or modify any aspect of them that affects their presentation, navigation, or templating, it might very likely affect the process of generating that content on PaddlePaddle.org. Thus, such changes should always be made with simultaneous updates to PaddlePaddle.org's code.



## Extending with new content sources

If you are a part of the core PaddlePaddle team and are tasked with introducing a new content repository to show up as documentation on the website, you may consider the following steps:
- Adding the repo as a submodule on the `FluidDoc` repo in the `external` directory.
- Modify `documentation_generator.py`.
- Read `url_helper.py` and the primary `urls.py` to understand how URLs might be constructed and rendered.


## Design considerations

Our intention is to keep PaddlePaddle.org's styling and brand consistent with https://ai.baidu.com, when it comes to typography, colors, and visual elements. When in doubt, use that website as a visual reference point.


## Reporting bugs and feature requests

If you do not feel comfortable contributing to the codebase yourself, but have suggestions, feedback, or wish to report bugs, we invite you to do so in the 'Issues' section of this repository. Feedback provided on informal channels has a tendency to get lost.

Critical production-related issues may be reported directly to [any of the top contributors](https://github.com/PaddlePaddle/PaddlePaddle.org/graphs/contributors) of this repo.
