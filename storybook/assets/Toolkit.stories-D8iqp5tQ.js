import{j as o}from"./iframe-DqJQ9uPs.js";import{c as e}from"./plugin-BWMFMYkc.js";import{S as l}from"./Grid-KKLALRV6.js";import{C as m}from"./ComponentAccordion-BwIssOK4.js";import{w as a}from"./appWrappers-DvUcS6kA.js";import{T as i}from"./TemplateBackstageLogoIcon-ArrPH9_F.js";import{I as s}from"./InfoCard-DfVmKB2_.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DUvFkCSb.js";import"./componentData-9JsUC9W5.js";import"./useAnalytics-CfDtSbQu.js";import"./useApp-ByL28iDl.js";import"./useRouteRef-DZAPdgx2.js";import"./index-DalzLXVm.js";import"./DialogTitle-DiqXRAVM.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./Backdrop-lmkQ576F.js";import"./Button-D9LFAX2g.js";import"./useObservable-CXAnoMNy.js";import"./useIsomorphicLayoutEffect-C4uh4-7_.js";import"./ExpandMore-BotAWQ1n.js";import"./AccordionDetails-Dyf75Eaf.js";import"./index-DnL3XN75.js";import"./Collapse-BECsH0M_.js";import"./useAsync-DlfksqDa.js";import"./useMountedState-BU_XpB7e.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C-XbivhQ.js";import"./ErrorBoundary-CCN1fcMR.js";import"./ErrorPanel-BTFsykmd.js";import"./WarningPanel-DWxbAFrU.js";import"./MarkdownContent-DTBwyM42.js";import"./CodeSnippet-BQDzaUOg.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./CopyTextButton-Y9iCOjyT.js";import"./useCopyToClipboard-DMYhOdjt.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./ListItem-DIBtNilh.js";import"./ListItemText-QaJAw11k.js";import"./LinkButton-CscTtu-Y.js";import"./Link-ClrQx1QP.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-C2FhjhCg.js";import"./Divider-xOTMBAcj.js";import"./CardActions-DVY4viYA.js";import"./BottomLink-v4r4qDIO.js";import"./ArrowForward-DPFWrTp5.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
