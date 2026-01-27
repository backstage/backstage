import{j as t,T as a,c,C as g,m as l}from"./iframe-D7tLk4ld.js";import{b as i,r as d}from"./plugin-D0BFLUdw.js";import{S as s}from"./Grid-DIKn7D0E.js";import{w as u}from"./appWrappers-LFN562Aq.js";import{T as f}from"./TemplateBackstageLogo-CLrZYfuD.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B7Cc_-YL.js";import"./componentData-Dqkdwtuq.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./useRouteRef-BfGdJ_eX.js";import"./index-aaT1AT_u.js";import"./InfoCard-v3VrqR1c.js";import"./CardContent-Ckitt63X.js";import"./ErrorBoundary-DBuFbPsZ.js";import"./ErrorPanel-CjfyCBSQ.js";import"./WarningPanel-waa_5WFz.js";import"./ExpandMore-Br1SomQR.js";import"./AccordionDetails-xzn6Vz4b.js";import"./index-B9sM2jn7.js";import"./Collapse-CJcP5srX.js";import"./MarkdownContent-DEtoV9Sg.js";import"./CodeSnippet-i4EOu1Cg.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./CopyTextButton-D-7TENHT.js";import"./useCopyToClipboard-DDHvggmk.js";import"./useMountedState-CdD92umV.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";import"./Portal-BczuNMGa.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./ListItem-bVDpz6Z-.js";import"./ListItemText-DUrf7V-S.js";import"./LinkButton-rPQfynvr.js";import"./Link-B-Kks6_R.js";import"./lodash-Czox7iJy.js";import"./Button-z5kV09UR.js";import"./CardHeader-wKEMhpg-.js";import"./Divider-Dcp5X0Oe.js";import"./CardActions-Bk3RRZ7t.js";import"./BottomLink-CYGivY5K.js";import"./ArrowForward-C-Ay2WeA.js";import"./DialogTitle-D56g35nD.js";import"./Modal-DgNAzS_W.js";import"./Backdrop-Cyu771p_.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./useAsync-PQB885ej.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
