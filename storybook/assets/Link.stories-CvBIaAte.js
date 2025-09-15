import{j as o}from"./jsx-runtime-hv06LKfz.js";import{L as i,N as m}from"./Link-DATBiw5a.js";import{R as n,a as p,u as c}from"./index-B7KODvs-.js";import{w as l,c as u}from"./appWrappers-CoX-UqDf.js";import{u as a}from"./useRouteRef-ZIOUJ-Yz.js";import"./index-D8-PC79C.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./createSvgIcon-968fIvf3.js";import"./capitalize-Cx0lXINv.js";import"./defaultTheme-BZ7Q3aB1.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./makeStyles-DNGcMHuZ.js";import"./Typography-BvnmTcFn.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./UnifiedThemeProvider-DlatTgRh.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-DJtd4kF-.js";import"./toArray-DBEVWI-m.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-CAdWyNck.js";import"./ThemeProvider-C3WTbj0u.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./componentData-DvKcogcx.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./ApiProvider-CYh4HGR1.js";import"./index-BKN9BsH4.js";const s=u({id:"storybook.test-route"}),d=()=>{const t=c();return o.jsxs("pre",{children:["Current location: ",t.pathname]})},no={title:"Navigation/Link",component:i,decorators:[t=>l(o.jsxs("div",{children:[o.jsx("div",{children:o.jsx(d,{})}),o.jsx(t,{})]}),{mountedRoutes:{"/hello":s}})]},e=()=>{const t=a(s);return o.jsxs(o.Fragment,{children:[o.jsx(i,{to:t(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",o.jsx(n,{children:o.jsx(p,{path:t(),element:o.jsx("h1",{children:"Hi there!"})})})]})},r=()=>{const t=a(s);return o.jsxs(o.Fragment,{children:[o.jsx(i,{to:t(),component:m,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",o.jsx(n,{children:o.jsx(p,{path:t(),element:o.jsx("h1",{children:"Hi there!"})})})]})};r.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"PassProps"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  return <>
      <Link to={link()}>This link</Link>&nbsp;will utilize the react-router
      MemoryRouter's navigation
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  return <>
      <Link to={link()}
    /** react-router-dom related prop */ component={RouterNavLink}
    /** material-ui related prop */ color="secondary">
        This link
      </Link>
      &nbsp;has props for both material-ui's component as well as for
      react-router-dom's
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>;
}`,...r.parameters?.docs?.source}}};const po=["Default","PassProps"];export{e as Default,r as PassProps,po as __namedExportsOrder,no as default};
