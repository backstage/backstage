import{j as t,T as a,c,C as g,m as l}from"./iframe-DVMaQ9oH.js";import{b as i,r as d}from"./plugin-i9GPhXRv.js";import{S as s}from"./Grid-BnNe0SDT.js";import{w as u}from"./appWrappers-DDl-WsMM.js";import{T as f}from"./TemplateBackstageLogo-BNF631mU.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CyrjOCVF.js";import"./componentData-CuhNelpK.js";import"./useAnalytics-D_e6aR87.js";import"./useApp-CbdAPFaX.js";import"./useRouteRef-DTds5z5u.js";import"./index-CrsCYslC.js";import"./InfoCard-CgW9jWlR.js";import"./CardContent-DALz_wlP.js";import"./ErrorBoundary-COMXETD1.js";import"./ErrorPanel-DOpGEyf2.js";import"./WarningPanel-C40EW-7C.js";import"./ExpandMore-BkRt0N0x.js";import"./AccordionDetails-DDgGuMuh.js";import"./index-B9sM2jn7.js";import"./Collapse-DjiqELor.js";import"./MarkdownContent-DWrveYca.js";import"./CodeSnippet-BT17ih3z.js";import"./Box-CFSsj6ua.js";import"./styled-BBv6xD1v.js";import"./CopyTextButton-DhPBCIRt.js";import"./useCopyToClipboard-C3pKoU0U.js";import"./useMountedState-CB6VIth1.js";import"./Tooltip-DuScsKtZ.js";import"./Popper-D9ki8Cw9.js";import"./Portal-B9YgpH-D.js";import"./List-Dti-y3i6.js";import"./ListContext-BKfPcfO0.js";import"./ListItem-D0hmS8se.js";import"./ListItemText-1_kgrXU9.js";import"./LinkButton-CLXyglo-.js";import"./Button-DnJe8T7L.js";import"./Link-INNWSaUp.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-anUaTI8l.js";import"./Divider-DFSugnoU.js";import"./CardActions-N5CiU28L.js";import"./BottomLink-CspCmDGQ.js";import"./ArrowForward-D-fiTE2a.js";import"./DialogTitle-BLuVPIsL.js";import"./Modal-CJ1fn4qg.js";import"./Backdrop-0IChyXw2.js";import"./useObservable-CxLKaDzP.js";import"./useIsomorphicLayoutEffect-Cs1tA7z9.js";import"./useAsync-C7ceDp4n.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
