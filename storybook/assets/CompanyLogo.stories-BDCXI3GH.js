import{j as t,T as a,c,C as g,m as l}from"./iframe-B9hgvJLw.js";import{b as i,r as d}from"./plugin-BFj5CARM.js";import{S as s}from"./Grid-g3HyMBvJ.js";import{w as u}from"./appWrappers-Du9InaF6.js";import{T as f}from"./TemplateBackstageLogo-CrymBNZn.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D-bM_T9Q.js";import"./componentData-BIeygeYY.js";import"./useAnalytics-DMsrMH_e.js";import"./useApp-DISJeDPh.js";import"./useRouteRef-nNeqZu86.js";import"./index-CsGVCGL2.js";import"./InfoCard-B0o9NPld.js";import"./CardContent-AsNKMLjW.js";import"./ErrorBoundary-C7aCcvr1.js";import"./ErrorPanel-CtYawyCD.js";import"./WarningPanel-CWYhx9r2.js";import"./ExpandMore-BoLpzv6N.js";import"./AccordionDetails-CKakyLf0.js";import"./index-B9sM2jn7.js";import"./Collapse-FgK-KUTI.js";import"./MarkdownContent-B8lxAtZu.js";import"./CodeSnippet-BVb_NoMX.js";import"./Box-BsI7Fu14.js";import"./styled-CF5nzrfv.js";import"./CopyTextButton-DAUaMyUM.js";import"./useCopyToClipboard-D14CO7yh.js";import"./useMountedState-kHvlJXnr.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";import"./Portal-pCoOC46-.js";import"./List-BDdcqK40.js";import"./ListContext-DgcYteU3.js";import"./ListItem-Bp1BuLev.js";import"./ListItemText-Bx_jgiBv.js";import"./LinkButton-DcZ0v-pe.js";import"./Link-C9X-RXqH.js";import"./lodash-Czox7iJy.js";import"./Button-D3LDd96-.js";import"./CardHeader-DiDbXSwI.js";import"./Divider-CdNlJD_Q.js";import"./CardActions-i3yuXfwJ.js";import"./BottomLink-CIhQcQIt.js";import"./ArrowForward-CIWVdsJM.js";import"./DialogTitle-D9yo_Iy-.js";import"./Modal-Ca-S6eXi.js";import"./Backdrop-BmcNn5D8.js";import"./useObservable-BcGRWwwK.js";import"./useIsomorphicLayoutEffect-DSwb9vld.js";import"./useAsync-y2hE-c2R.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
