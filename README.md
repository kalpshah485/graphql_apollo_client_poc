![Logo](https://www.simform.com/wp-content/uploads/2022/12/logo.svg)
# React Js Boilerplate
This boilerplate is starting point of any project with all batteries included. you can directly start development without spending time on project setup.
## Tech Stack
**Client:** [React](react.dev), [Typescript](https://www.typescriptlang.org), [Vite](https://vitejs.dev/), [Apollo Client](https://www.apollographql.com/docs/react/), [React Router](https://reactrouter.com/en/main), 
 

**Styling:**  [Storybook](https://storybook.js.org/), 

**Code Formatter:** [Prettier](https://prettier.io/),   [Eslint](https://eslint.org/) 


### Developer Guide

1. To begin, set your Git username and email using the following commands:
   - `git config user.name "{username}"`
   - `git config user.email "{email}"`

2. Avoid pushing or committing directly to the `main` branch.

3. When creating a new branch, use one of the following naming conventions:
   - `feature/feature-name`
   - `bug/bug-details`
   - `design/design-details`

4. Format your commit messages as `Ticket number : Title` only. For example: `T-101 : Deploy site on production environment.`

5. Prior to committing, ensure you verify and resolve linting issues by running the following commands:
   - `npm run lint`
   - `npm run lint:fix`

6. Each Pull Request (PR) should contain only a single commit. If you've made multiple commits, rebase them into a single commit before submitting the PR.

7. Add comments when necessary for better understanding, and make further improvements as needed.

8. Customize the ESLint rules in the .eslintrc.cjs file to meet your project's specific requirements.

### Other useful scripts
- `npm run build` to build a project
- `npm run dev` to run (dev) a project
- `npm run build` to build a project
- `npm run preview` to run preview a project
- `npm run lint` to lint a project 
 - `npm run lint:fix` to lint:fix a project
- `npm run format` to format a project
- `npm run storybook` to start storybook dev server 
 - `npm run build-storybook` to build storybook