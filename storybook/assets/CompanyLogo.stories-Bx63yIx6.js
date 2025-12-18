import{j as t,T as a,c,C as g,m as l}from"./iframe-BY8lR-L8.js";import{b as i,r as d}from"./plugin-BzoiYKlF.js";import{S as s}from"./Grid-BjrJvsR3.js";import{w as u}from"./appWrappers-CwbFz284.js";import{T as f}from"./TemplateBackstageLogo-C9aDdhjM.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-pD8p1KrB.js";import"./componentData-UKDdzeuB.js";import"./useAnalytics-BVxeCBFY.js";import"./useApp-BvPEffuf.js";import"./useRouteRef-X5r9b_hf.js";import"./index-BS6rRTnv.js";import"./InfoCard-9a18SuEb.js";import"./CardContent-B8GBl9qU.js";import"./ErrorBoundary-BxthC0Iq.js";import"./ErrorPanel-DUhzHP9c.js";import"./WarningPanel-wg4n1CXF.js";import"./ExpandMore-fkHecgaQ.js";import"./AccordionDetails-Fks5AbbD.js";import"./index-B9sM2jn7.js";import"./Collapse-B6v7_Lug.js";import"./MarkdownContent-CEOHELvX.js";import"./CodeSnippet-ajdkoRYg.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./CopyTextButton-HjsOaOKI.js";import"./useCopyToClipboard-Bl5GfTuC.js";import"./useMountedState-DwTRr6Bf.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";import"./Portal-9M61fEx6.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./ListItem-CGZ3ypeU.js";import"./ListItemText-BFb2Grym.js";import"./LinkButton-0O3nZFeQ.js";import"./Button-DOtnJgPP.js";import"./Link-CG56jGaN.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-Hrxg6OrZ.js";import"./Divider-C9c6KGoD.js";import"./CardActions-D47ZvRGZ.js";import"./BottomLink-C0C-DKvG.js";import"./ArrowForward-BmZGDfYA.js";import"./DialogTitle-DJH-tFiF.js";import"./Modal-ob7ZinQq.js";import"./Backdrop-NlvjxJvh.js";import"./useObservable-DjQNHeFS.js";import"./useIsomorphicLayoutEffect-4IAuBrOv.js";import"./useAsync-DNLOGNju.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
