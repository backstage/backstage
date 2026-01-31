import{j as t,U as a,V as c,W as g,m as l}from"./iframe-Bz1IoDwg.js";import{b as i,r as d}from"./plugin-q910FEE9.js";import{S as s}from"./Grid-DSK0Sob8.js";import{w as u}from"./appWrappers-BObMNmL2.js";import{T as f}from"./TemplateBackstageLogo-SyEgJIdw.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CE0ZYiwI.js";import"./componentData-7nshGulq.js";import"./useAnalytics-CTEKxLAM.js";import"./useApp-PKPW6CfH.js";import"./useRouteRef-DtU3fdAe.js";import"./index-CrqMr4SR.js";import"./InfoCard-ceQikPA4.js";import"./CardContent-BQfvLFX1.js";import"./ErrorBoundary-ClRuUrD5.js";import"./ErrorPanel-BtAfCzwR.js";import"./WarningPanel-Bny1Wix5.js";import"./ExpandMore-Dlvt5b42.js";import"./AccordionDetails-qNBrrRUw.js";import"./index-B9sM2jn7.js";import"./Collapse-C7ZfnDjZ.js";import"./MarkdownContent-DPlVt8XM.js";import"./CodeSnippet-BhvDpqOl.js";import"./Box-B4X1pSLD.js";import"./styled-nJYZvWBJ.js";import"./CopyTextButton-B02pGVBs.js";import"./useCopyToClipboard-lsM1yAtv.js";import"./useMountedState-CBRaKuhZ.js";import"./Tooltip-Dnn6Xi1p.js";import"./Popper-vOyuMRKf.js";import"./Portal-nnGdoBnk.js";import"./List-BuBw1TsS.js";import"./ListContext-BU0MJFdF.js";import"./ListItem-DwPXYlNl.js";import"./ListItemText-uP05tp0v.js";import"./LinkButton-BoLHewK-.js";import"./Link-BTTdXJ1E.js";import"./lodash-Czox7iJy.js";import"./Button-CfSoEum0.js";import"./CardHeader-B4_QbTWl.js";import"./Divider-D1ZXem9_.js";import"./CardActions-DxHgMSOJ.js";import"./BottomLink-DMb0ahl7.js";import"./ArrowForward-e_qRJmu3.js";import"./DialogTitle-DuwIaY1G.js";import"./Modal-Bl681vyA.js";import"./Backdrop-ealuYeba.js";import"./useObservable-DO4febub.js";import"./useIsomorphicLayoutEffect-BDov4fhP.js";import"./useAsync-m1QKb3St.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
