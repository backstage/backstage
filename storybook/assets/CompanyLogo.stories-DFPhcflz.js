import{j as t,T as a,c,C as g,m as l}from"./iframe-Ck0aXmTM.js";import{b as i,r as d}from"./plugin-DWMh387_.js";import{S as s}from"./Grid-DJzZ2-y-.js";import{w as u}from"./appWrappers-sOes-H4-.js";import{T as f}from"./TemplateBackstageLogo-BNh6zXRK.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D0ldxJ2a.js";import"./componentData-CCV_iCSl.js";import"./useAnalytics-B-_BiaZI.js";import"./useApp-Bsc5dzDy.js";import"./useRouteRef-CUlQEYbr.js";import"./index-DzaKdVpu.js";import"./InfoCard-XzrYcPvm.js";import"./CardContent-CrT56zzi.js";import"./ErrorBoundary-BLpzyTxf.js";import"./ErrorPanel-SFTFZur6.js";import"./WarningPanel-BnKvh7bd.js";import"./ExpandMore-XskE5SkY.js";import"./AccordionDetails-Dunbukgx.js";import"./index-B9sM2jn7.js";import"./Collapse-DxAw5EoH.js";import"./MarkdownContent-DTz2Je40.js";import"./CodeSnippet-1zCVoflW.js";import"./Box-DpOIFL5c.js";import"./styled-DLjnXpzN.js";import"./CopyTextButton-C18-3nwc.js";import"./useCopyToClipboard-g3w1_GHx.js";import"./useMountedState-BgEDmEmL.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";import"./Portal-enzQuAv4.js";import"./List-Ch4xqBdJ.js";import"./ListContext-m5pyxhJx.js";import"./ListItem-BI_yLDsO.js";import"./ListItemText-BN5MiG2A.js";import"./LinkButton-D0uXKDvs.js";import"./Button-1pGVjime.js";import"./Link-8mv2gKfv.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-BGZWsIne.js";import"./Divider-B0knNu2M.js";import"./CardActions-B9r0eKLY.js";import"./BottomLink-Cj7rNAle.js";import"./ArrowForward-DkJkdPgV.js";import"./DialogTitle-CrkBwyZG.js";import"./Modal-CynqYC-h.js";import"./Backdrop-D-sGQwlB.js";import"./useObservable-DUKTvAPs.js";import"./useIsomorphicLayoutEffect-CpSeSuYs.js";import"./useAsync-p0jLc8GG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
