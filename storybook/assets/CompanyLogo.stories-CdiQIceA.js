import{j as t,T as a,c,C as g,m as l}from"./iframe-omS-VfEE.js";import{b as i,r as d}from"./plugin-COsCyJhl.js";import{S as s}from"./Grid-BYUcu-HN.js";import{w as u}from"./appWrappers-D_rcKu23.js";import{T as f}from"./TemplateBackstageLogo-DgIXJPlo.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CgzkpFyB.js";import"./componentData-rUfARfxE.js";import"./useAnalytics-DpXUy368.js";import"./useApp-DFGFX2A_.js";import"./useRouteRef-Q1h4R6gV.js";import"./index-BJYML3pb.js";import"./InfoCard-k7q1vcR-.js";import"./CardContent-mylIdFzd.js";import"./ErrorBoundary-bGwTKSED.js";import"./ErrorPanel-NSHOjdDK.js";import"./WarningPanel-BpYFzcLR.js";import"./ExpandMore-B7pPANEl.js";import"./AccordionDetails-BhNEpOi0.js";import"./index-B9sM2jn7.js";import"./Collapse-BMfiGGQz.js";import"./MarkdownContent-CrQrCbdZ.js";import"./CodeSnippet-D7viEsWF.js";import"./Box-CkfuSc_q.js";import"./styled-D7Xcwibq.js";import"./CopyTextButton-Dpc4LkrT.js";import"./useCopyToClipboard-fqzv143-.js";import"./useMountedState-B72_4ZkH.js";import"./Tooltip-ER_nPOs0.js";import"./Popper-DnFnSudK.js";import"./Portal-tl-MtD9Q.js";import"./List-C9vsaZyo.js";import"./ListContext-CkIdZQYa.js";import"./ListItem-CyW2KymL.js";import"./ListItemText-pfsweG72.js";import"./LinkButton-D_wGBfsj.js";import"./Button-cwljLBUl.js";import"./Link-BWOCx2Nz.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-Bsb9krxm.js";import"./Divider-B1hRM44o.js";import"./CardActions-BmZcl3bV.js";import"./BottomLink-BEo5oPXt.js";import"./ArrowForward-Q3VMHoWX.js";import"./DialogTitle-CbcbXP0z.js";import"./Modal-BJT6EnpA.js";import"./Backdrop-peojPdzD.js";import"./useObservable-CWiuwahj.js";import"./useIsomorphicLayoutEffect-NeOa0wWc.js";import"./useAsync-XDPyEQBh.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
