import{j as t,T as a,c,C as g,m as l}from"./iframe-hvh2aMf9.js";import{b as i,r as d}from"./plugin-DBTSfPRA.js";import{S as s}from"./Grid-DbJ44Ewx.js";import{w as u}from"./appWrappers-Br-zmgYb.js";import{T as f}from"./TemplateBackstageLogo-xQVznHXZ.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BVqzn08d.js";import"./componentData-DJ30wAD0.js";import"./useAnalytics-CVphDHTH.js";import"./useApp-CqXr_4Cz.js";import"./useRouteRef-CAeo51pw.js";import"./index-7QU1_rFp.js";import"./InfoCard-C848hzjp.js";import"./CardContent-DN23BuSy.js";import"./ErrorBoundary-Dh8qKDOl.js";import"./ErrorPanel-DykIF4Ux.js";import"./WarningPanel-CJ_nUs4N.js";import"./ExpandMore-nelLsYHb.js";import"./AccordionDetails-DLZ6dsCT.js";import"./index-DnL3XN75.js";import"./Collapse-PeWKU6hc.js";import"./MarkdownContent-DCK-3Ric.js";import"./CodeSnippet-5nQo7gNl.js";import"./Box-BjIjXY28.js";import"./styled-CsVOCgfV.js";import"./CopyTextButton-FOvJ_Vam.js";import"./useCopyToClipboard-D9VM6fel.js";import"./useMountedState-CuwT9qKs.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";import"./Portal-Bb9zcDOK.js";import"./List-74W1l74F.js";import"./ListContext-DMJfGJuk.js";import"./ListItem-CXtueEiL.js";import"./ListItemText-Cnvrb4zg.js";import"./LinkButton-CbQ3iKUC.js";import"./Button-DCfJTuUb.js";import"./Link-CHVET8I2.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CuySZ8Hj.js";import"./Divider-D1DdZhOv.js";import"./CardActions-DuulD9pz.js";import"./BottomLink-Svs5ms_-.js";import"./ArrowForward-DlduA0Ms.js";import"./DialogTitle-GCc4cGcE.js";import"./Modal-D7enm8Ov.js";import"./Backdrop-B_m0crbj.js";import"./useObservable-BBWREk27.js";import"./useIsomorphicLayoutEffect-BrJ5WAHL.js";import"./useAsync-DTXafnw5.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const yo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
