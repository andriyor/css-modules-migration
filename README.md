# migrate-to-css-modules

Idea of project based on this article [How we migrated entirely to CSS Modules using codemods and Sourcegraph Code Insights](https://about.sourcegraph.com/blog/migrating-to-css-modules-with-codemods-and-code-insights)

## Supported migrations

- [x] `import './App.scss';` to `import styles from './App.module.scss';`
- [x] `className='App'` to `className={styles.App}`
- [x] `id='idSelector'` to `id={styles.idSelector}`
- [x] `className='selector1 selector2'` to `` className={`${styles.selector1} ${styles.selector2}`} ``
- [x] `className='d-flex menu'` to `` className={`d-flex ${styles.menu}`} ``
- [x] `className={["listRule1", "listRule2"].join(" ")}` to `className={[styles.listRule1, styles.listRule2].join(" ")}`
- [x] `className="kebab-case"` to `className={styles["kebab-case"]}`
