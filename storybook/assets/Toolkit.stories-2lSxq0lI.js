import{j as o}from"./iframe-DLxOzT4t.js";import{c as e}from"./plugin-D1Vsl5C_.js";import{S as l}from"./Grid-DTcNMdF5.js";import{C as m}from"./ComponentAccordion-BvK_g7fJ.js";import{w as a}from"./appWrappers-BgZnm0lF.js";import{T as i}from"./TemplateBackstageLogoIcon-CKcA8xn-.js";import{I as s}from"./InfoCard-BX_nQnVA.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-D7Oiw_QY.js";import"./componentData-B5NpAqVg.js";import"./useAnalytics-iDMqp06i.js";import"./useApp-CkqCNNj_.js";import"./useRouteRef-HPNEm24O.js";import"./index-YuKWWjwW.js";import"./DialogTitle-Dn15pT6I.js";import"./Modal-7EqbtETg.js";import"./Portal-CdFb3as0.js";import"./Backdrop-D5lzsJdl.js";import"./Button-DWoU60bY.js";import"./useObservable-Bzw4Lu4i.js";import"./ExpandMore-K2fwTw0G.js";import"./AccordionDetails-DoLgEhQ2.js";import"./index-DnL3XN75.js";import"./Collapse-Dx6BQFCw.js";import"./useAsync-CNKDNBbw.js";import"./useMountedState-DJ6mJaNE.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Bj7b70Os.js";import"./ErrorBoundary-KnBb7wcL.js";import"./ErrorPanel-RMUJvBFr.js";import"./WarningPanel-Dc2tcH1q.js";import"./MarkdownContent-C4aBi8UG.js";import"./CodeSnippet-Drl8Y1S9.js";import"./Box-BEY2IraA.js";import"./styled-C22knZjm.js";import"./CopyTextButton-B07LVSwl.js";import"./useCopyToClipboard-C72jLjo9.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";import"./List-D0oVWlo0.js";import"./ListContext-CoRXql5V.js";import"./ListItem-C0vbBd3c.js";import"./ListItemText-DNlkMNGC.js";import"./LinkButton-BJUAlKHF.js";import"./Link-CRIj9jSl.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-DKM6gr3f.js";import"./Divider-CWCd2akK.js";import"./CardActions-C6azI5IY.js";import"./BottomLink-BLtQezSR.js";import"./ArrowForward-BRfxW2ea.js";const so={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const co=["Default","InAccordion"];export{r as Default,t as InAccordion,co as __namedExportsOrder,so as default};
