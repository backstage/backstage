import{j as t,T as a,c,C as g,m as l}from"./iframe-DGs96NRX.js";import{b as i,r as d}from"./plugin-DhChxGdP.js";import{S as s}from"./Grid-BHZNDkgf.js";import{w as u}from"./appWrappers-Dk3b9LWk.js";import{T as f}from"./TemplateBackstageLogo-DA4ep3po.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-D2IBlZ3_.js";import"./componentData-DWCQSrQj.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useApp-Sx5G5NdM.js";import"./useRouteRef-XG42dmXR.js";import"./index-Du2IYsJS.js";import"./InfoCard-CVq5vFZI.js";import"./CardContent-D_Z8OSfu.js";import"./ErrorBoundary-Dc-3W-6w.js";import"./ErrorPanel-CNmGi6XN.js";import"./WarningPanel-Ci1uty-p.js";import"./ExpandMore-sv7y42DS.js";import"./AccordionDetails-DcDYdNfQ.js";import"./index-DnL3XN75.js";import"./Collapse-B15AMTul.js";import"./MarkdownContent-BL9CdgAN.js";import"./CodeSnippet-_eOoFouG.js";import"./Box-D4WzEFhv.js";import"./styled-BpF5KOwn.js";import"./CopyTextButton-BnG0iIPf.js";import"./useCopyToClipboard-CMVqWLvJ.js";import"./useMountedState-CrWRPmTB.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";import"./Portal-d4IyiHDj.js";import"./List-6sBN0fEc.js";import"./ListContext-JUKi6eaD.js";import"./ListItem-B6WkBU7i.js";import"./ListItemText-DKlzuA8v.js";import"./LinkButton-IIcYw6pZ.js";import"./Button-Nle0L9Fl.js";import"./Link-GHtCGRiO.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DEMtBZ-P.js";import"./Divider-D5eOEnUc.js";import"./CardActions-BH_5asRW.js";import"./BottomLink-V5hYwYd7.js";import"./ArrowForward-D58oRGFf.js";import"./DialogTitle-BKLIXxRc.js";import"./Modal-BddTY979.js";import"./Backdrop-DikSmCJp.js";import"./useObservable-DHsdD1qc.js";import"./useIsomorphicLayoutEffect-CVR0SjCS.js";import"./useAsync-Bl5kKHyn.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
