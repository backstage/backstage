import{j as t,T as a,c,C as g,m as l}from"./iframe-Du4yWFmh.js";import{b as i,r as d}from"./plugin-DgWnl-36.js";import{S as s}from"./Grid-BAWrmmwT.js";import{w as u}from"./appWrappers-C6fp3G6q.js";import{T as f}from"./TemplateBackstageLogo-D6SkVoV5.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-tqD9UBew.js";import"./componentData-Cum-Z3JG.js";import"./useAnalytics-mdAgoHs9.js";import"./useApp-DvME4Mfb.js";import"./useRouteRef-C6zbOJHI.js";import"./index-Br3zvZN_.js";import"./InfoCard-BlSgdS8H.js";import"./CardContent-AeX-1A09.js";import"./ErrorBoundary-BfVWC_KB.js";import"./ErrorPanel-Bjzvo6fH.js";import"./WarningPanel-YDZfKCG0.js";import"./ExpandMore-B4oHnhmj.js";import"./AccordionDetails-Bs2ZQrVE.js";import"./index-B9sM2jn7.js";import"./Collapse-CJL9VCPm.js";import"./MarkdownContent-DScxBhmk.js";import"./CodeSnippet-QaiBHOZa.js";import"./Box-CkOOyHi_.js";import"./styled-B5kNIoL_.js";import"./CopyTextButton-zIe-ESin.js";import"./useCopyToClipboard-GTE9QNgz.js";import"./useMountedState-DMz1NfKI.js";import"./Tooltip-CxJ8vwKd.js";import"./Popper-Bc6CEfjX.js";import"./Portal-CRhyxH_K.js";import"./List-C8YUr1Px.js";import"./ListContext-CCATEDcQ.js";import"./ListItem-CR_jODVH.js";import"./ListItemText-BFdXXm3F.js";import"./LinkButton-B11jcSTr.js";import"./Button-C5V9YZrj.js";import"./Link-BchXRwcV.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DmTNyK4m.js";import"./Divider-BJZ8WmAv.js";import"./CardActions-F6l5rDAo.js";import"./BottomLink-YrEzVC2D.js";import"./ArrowForward-tmFPzWCr.js";import"./DialogTitle-Cps86Mxp.js";import"./Modal-CcLAGJZ_.js";import"./Backdrop-Bdb7V_oo.js";import"./useObservable-BMdH8T7u.js";import"./useIsomorphicLayoutEffect-CE2PLaCN.js";import"./useAsync-BpPAnWcd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
