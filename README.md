# migrate-to-css-modules

Idea of project based on this article [How we migrated entirely to CSS Modules using codemods and Sourcegraph Code Insights](https://about.sourcegraph.com/blog/migrating-to-css-modules-with-codemods-and-code-insights)

## Support

- [x] `import './App.scss';` to `import styles from './App.module.scss';`
- [x] `className='App'` to `className={styles.App}`
- [x] `id='idSelector'` to `id={styles.idSelector}`
- [x] `className='d-flex menu'` to `` className={`d-flex ${styles.menu}`} ``
