import{j as t,T as a,c,C as g,m as l}from"./iframe-BOS9XsSt.js";import{b as i,r as d}from"./plugin-wCQqv6mY.js";import{S as s}from"./Grid-DpJzwvsy.js";import{w as u}from"./appWrappers-Bmoaw7n3.js";import{T as f}from"./TemplateBackstageLogo-CKKBbJwa.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BLgAY6cH.js";import"./componentData-5CzPqeYQ.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useApp-D9_f5DFp.js";import"./useRouteRef-D6pX7G_I.js";import"./index-BYPtPQ_E.js";import"./InfoCard-fL2e7Fb-.js";import"./CardContent-BiZP4o13.js";import"./ErrorBoundary-Biou5a7y.js";import"./ErrorPanel-DvbxkBY0.js";import"./WarningPanel-DBRwILC2.js";import"./ExpandMore-DPjiSkKA.js";import"./AccordionDetails-CY60n5OB.js";import"./index-B9sM2jn7.js";import"./Collapse-CD_ND2rt.js";import"./MarkdownContent-BPIFlL-y.js";import"./CodeSnippet-CVmjwtmC.js";import"./Box-BWfLAxjo.js";import"./styled-dnrl8B5-.js";import"./CopyTextButton-Bp4E28TJ.js";import"./useCopyToClipboard-hUj9jZ5o.js";import"./useMountedState-DaLgI8Ua.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";import"./Portal-CERNgFq6.js";import"./List-BHDOi6uW.js";import"./ListContext-a1j27SdY.js";import"./ListItem-D4jOCDNX.js";import"./ListItemText-BRz_C0D5.js";import"./LinkButton-Cfhz45Fp.js";import"./Link-B09CKdbR.js";import"./lodash-Czox7iJy.js";import"./Button-D34xgd1Q.js";import"./CardHeader-CW0rLmly.js";import"./Divider-CxQHAU7C.js";import"./CardActions-DzUljMxl.js";import"./BottomLink-uXx83WET.js";import"./ArrowForward-DrsDRv_i.js";import"./DialogTitle-DX7hGYAC.js";import"./Modal-B4EjrvcH.js";import"./Backdrop-CpYmoctA.js";import"./useObservable-DDhxjihL.js";import"./useIsomorphicLayoutEffect-CrKWISEl.js";import"./useAsync-DzexZZOZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const {
    container
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    container,
    svg,
    path
  } = useLogoStyles();
  return <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
      svg,
      path
    }} />} />
    </Grid>;
}`,...e.parameters?.docs?.source}}};const Co=["Default","CustomLogo"];export{e as CustomLogo,r as Default,Co as __namedExportsOrder,yo as default};
