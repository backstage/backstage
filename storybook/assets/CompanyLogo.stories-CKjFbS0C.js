import{j as t,U as a,V as c,W as g,m as l}from"./iframe-Cih9KYts.js";import{b as i,r as d}from"./plugin-3Q6LhQe7.js";import{S as s}from"./Grid-CLRvRbDN.js";import{w as u}from"./appWrappers-C7AQtpTy.js";import{T as f}from"./TemplateBackstageLogo-BwZV4v6f.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C_qaKzy-.js";import"./componentData-DlgYE3l_.js";import"./useAnalytics-Cmhz127l.js";import"./useApp-sV2xt9cM.js";import"./useRouteRef-DDi4DkR7.js";import"./index-Bp0jFuCJ.js";import"./InfoCard-BJ74Wy1V.js";import"./CardContent-BSBI4Wy_.js";import"./ErrorBoundary-k6DARfl7.js";import"./ErrorPanel-DT8LzRfG.js";import"./WarningPanel-Cevqk5r0.js";import"./ExpandMore-Dc1qa72P.js";import"./AccordionDetails-CzBbo4eK.js";import"./index-B9sM2jn7.js";import"./Collapse-B12c-Txj.js";import"./MarkdownContent-DcL7o88V.js";import"./CodeSnippet-vQgCgAWU.js";import"./Box-5LOyitj9.js";import"./styled-VBtFtbNj.js";import"./CopyTextButton-CcbF4huw.js";import"./useCopyToClipboard-7I7t0jup.js";import"./useMountedState-BYMagqon.js";import"./Tooltip-CgFVFwTk.js";import"./Popper-D0FUS77U.js";import"./Portal-DG1SCA6E.js";import"./List-DfB6hke5.js";import"./ListContext-DH23_8Wk.js";import"./ListItem-D5wUjexN.js";import"./ListItemText-jFKdxWsL.js";import"./LinkButton-CWYcR8SV.js";import"./Link-Ds2c62Jm.js";import"./lodash-Czox7iJy.js";import"./Button-CKd96K2t.js";import"./CardHeader-CcUDO6MN.js";import"./Divider-BNkMSFIU.js";import"./CardActions-BWT2Xrl1.js";import"./BottomLink-o8fjmmLZ.js";import"./ArrowForward-Br-ribbp.js";import"./DialogTitle-CuYpVqTb.js";import"./Modal-BZoQWh9B.js";import"./Backdrop-DyvTB40d.js";import"./useObservable-BtgVS7-k.js";import"./useIsomorphicLayoutEffect-dPDL8wRM.js";import"./useAsync-DPHt3xdh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})],tags:["!manifest"]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
