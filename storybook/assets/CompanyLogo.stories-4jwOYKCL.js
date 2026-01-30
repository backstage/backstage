import{j as t,U as a,V as c,W as g,m as l}from"./iframe-Dc6SVWG5.js";import{b as i,r as d}from"./plugin-BlGK1-aG.js";import{S as s}from"./Grid-BSXyf9SS.js";import{w as u}from"./appWrappers-BS_aK2if.js";import{T as f}from"./TemplateBackstageLogo-CdQu_cYd.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Bqo592_1.js";import"./componentData-B8Jq35jm.js";import"./useAnalytics-BxYnHleN.js";import"./useApp-B6m3gjBm.js";import"./useRouteRef-ntEBWiMC.js";import"./index-8XuG-gel.js";import"./InfoCard-D2Dsw8kY.js";import"./CardContent-BBDXdNq6.js";import"./ErrorBoundary-DNl5LSbb.js";import"./ErrorPanel-D-ezxJ4v.js";import"./WarningPanel-C3dDiuJG.js";import"./ExpandMore-DbnKJ-3Y.js";import"./AccordionDetails-CK24iBmJ.js";import"./index-B9sM2jn7.js";import"./Collapse-5pSFEBGG.js";import"./MarkdownContent-B1WuysOW.js";import"./CodeSnippet-BullD9eL.js";import"./Box-DORcO5nL.js";import"./styled-Dq5lPzbL.js";import"./CopyTextButton-B-mnnb3d.js";import"./useCopyToClipboard-CBsscp3Q.js";import"./useMountedState-1x78q3TT.js";import"./Tooltip-C8OYhGnh.js";import"./Popper-CJ7TZbcE.js";import"./Portal-COm53pHi.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./ListItem-BhueXXFi.js";import"./ListItemText-BD21enaM.js";import"./LinkButton-BpB7BUZ5.js";import"./Link-CiS0SEiJ.js";import"./lodash-Czox7iJy.js";import"./Button-CRU2KsP0.js";import"./CardHeader-WVbEoKUm.js";import"./Divider-B6Rq6sfT.js";import"./CardActions-B8JlOWcD.js";import"./BottomLink-CKkdm6Qn.js";import"./ArrowForward-CnwzCGwZ.js";import"./DialogTitle-Blj5CnhU.js";import"./Modal-DUt8H3ab.js";import"./Backdrop-DWd11VkA.js";import"./useObservable-BhSXlvnh.js";import"./useIsomorphicLayoutEffect-4X9BfDi_.js";import"./useAsync-BGeZ5faP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
