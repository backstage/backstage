import{j as t,T as a,c,C as g,m as l}from"./iframe-BKfEGE7G.js";import{b as i,r as d}from"./plugin-BOqA5qbY.js";import{S as s}from"./Grid-vX9qBbX0.js";import{w as u}from"./appWrappers-BhL0UeRU.js";import{T as f}from"./TemplateBackstageLogo-DHJsw7Xz.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CmKCshsM.js";import"./componentData-MugjuQjt.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./useRouteRef-B__3vLRT.js";import"./index-DxVjIFhW.js";import"./InfoCard-BPOeB8Dc.js";import"./CardContent-DrXXBE5X.js";import"./ErrorBoundary-DggD4pwq.js";import"./ErrorPanel-D0Z-D0YB.js";import"./WarningPanel-BmLRnDjl.js";import"./ExpandMore-Bf4tz0ks.js";import"./AccordionDetails-DO5qN2es.js";import"./index-DnL3XN75.js";import"./Collapse-Bj6_bX8n.js";import"./MarkdownContent-BbcMZHtE.js";import"./CodeSnippet-4N0YB7qg.js";import"./Box-BJlQ2iQy.js";import"./styled-B4-rL4TL.js";import"./CopyTextButton-_rHychZO.js";import"./useCopyToClipboard-By-88AN1.js";import"./useMountedState-Bzk_h1H1.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";import"./Portal-Dl4iECMi.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./ListItem-DH54cTxL.js";import"./ListItemText-DfnmZGrz.js";import"./LinkButton-Dp8nvFiv.js";import"./Button-CBt-BxVf.js";import"./Link-CDMP9pev.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-pOr2jc7f.js";import"./Divider-B7pMmKOl.js";import"./CardActions-D1j0vYEk.js";import"./BottomLink-DpbJPqBE.js";import"./ArrowForward-BWmuSl5e.js";import"./DialogTitle-COtGSIrZ.js";import"./Modal-CvEZPVbb.js";import"./Backdrop-TvGNQn7O.js";import"./useObservable-1flBwXTR.js";import"./useAsync-DF0QzlTM.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";const fo={title:"Plugins/Home/Components/CompanyLogo",decorators:[o=>u(t.jsx(a,{apis:[[c,new g({app:{title:"My App"}})]],children:t.jsx(o,{})}),{mountedRoutes:{"/hello-company-logo":d}})]},n=l(o=>({container:{margin:o.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),r=()=>{const{container:o}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o})})},e=()=>{const{container:o,svg:m,path:p}=n();return t.jsx(s,{container:!0,justifyContent:"center",spacing:6,children:t.jsx(i,{className:o,logo:t.jsx(f,{classes:{svg:m,path:p}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};e.__docgenInfo={description:"",methods:[],displayName:"CustomLogo"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const yo=["Default","CustomLogo"];export{e as CustomLogo,r as Default,yo as __namedExportsOrder,fo as default};
