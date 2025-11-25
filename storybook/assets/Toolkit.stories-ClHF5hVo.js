import{j as o}from"./iframe-DVllq_JJ.js";import{c as e}from"./plugin-D3vE2yAH.js";import{S as l}from"./Grid-GLf92srY.js";import{C as m}from"./ComponentAccordion-BIb3F-yy.js";import{w as a}from"./appWrappers-C9euYDcG.js";import{T as i}from"./TemplateBackstageLogoIcon-03f1BulO.js";import{I as s}from"./InfoCard-CHyQV-0n.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DZCzK3PC.js";import"./componentData-ir7sX7tS.js";import"./useAnalytics-gDAqv4j8.js";import"./useApp-CkFK6AHh.js";import"./useRouteRef-Dq-yTMyo.js";import"./index-CuC9x3hw.js";import"./DialogTitle-tzRl7hzM.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./Backdrop-bmyTmjrQ.js";import"./Button-CqkFteVA.js";import"./useObservable-cKfOObA8.js";import"./useIsomorphicLayoutEffect-DMTlV3dY.js";import"./ExpandMore-DeLbxlk1.js";import"./AccordionDetails-Df6QxQno.js";import"./index-DnL3XN75.js";import"./Collapse-BPkQPj1V.js";import"./useAsync-2B4YlYUd.js";import"./useMountedState-CAQUPkod.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BJRiL5GO.js";import"./ErrorBoundary-BL32Oe-y.js";import"./ErrorPanel-Yv09NjH-.js";import"./WarningPanel-CTVbrDnl.js";import"./MarkdownContent-C4WJ4LoY.js";import"./CodeSnippet-pYWcNvfR.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./CopyTextButton-DyV_pNjJ.js";import"./useCopyToClipboard-DQH_xRRB.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./ListItem-DLfoHZ9h.js";import"./ListItemText-C9klhbSR.js";import"./LinkButton-CyMvoAXZ.js";import"./Link-Dfj65VZ1.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-9ttq-nyk.js";import"./Divider-CjoboeOw.js";import"./CardActions-CigbsVLY.js";import"./BottomLink-C3Knj5tN.js";import"./ArrowForward-_2sqR9gC.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
