import{j as o}from"./iframe-BpYUhtQT.js";import{c as e}from"./plugin-CvKOWj6E.js";import{S as l}from"./Grid-BSBIJVeD.js";import{C as m}from"./ComponentAccordion-CK0thCyo.js";import{w as a}from"./appWrappers-peGXwDQa.js";import{T as i}from"./TemplateBackstageLogoIcon-2QqXycIg.js";import{I as s}from"./InfoCard-BU1H8Nsz.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DowXY3sc.js";import"./componentData-BaoDxexO.js";import"./useAnalytics-Bh2pk9PK.js";import"./useApp-DvIsmpbF.js";import"./useRouteRef-l3dtiGOV.js";import"./index-Ce36-Nje.js";import"./DialogTitle-CB5Y5dHf.js";import"./Modal-0XcuTVfd.js";import"./Portal-OHyZAVgE.js";import"./Backdrop-RvGqs8Vm.js";import"./Button-BY1Og1vF.js";import"./useObservable-3jB7UW4m.js";import"./useIsomorphicLayoutEffect-1EIRTIdR.js";import"./ExpandMore-CeSJ010X.js";import"./AccordionDetails-fjjprATf.js";import"./index-DnL3XN75.js";import"./Collapse-CmnpFYn4.js";import"./useAsync-BpYeyvGz.js";import"./useMountedState-DBGgrpWA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BIK6qFXi.js";import"./ErrorBoundary-DzqamQ5F.js";import"./ErrorPanel-DX0kqAsP.js";import"./WarningPanel-8zkHCnj8.js";import"./MarkdownContent-BWS4BjxZ.js";import"./CodeSnippet-C2KdpqrO.js";import"./Box-DFzIAW_k.js";import"./styled-CvmEiBn0.js";import"./CopyTextButton-DC1eYg7O.js";import"./useCopyToClipboard-shAo73Yc.js";import"./Tooltip-CKt0VlQr.js";import"./Popper-mZ76pVB3.js";import"./List-CSZ53dK9.js";import"./ListContext-MOdDfATV.js";import"./ListItem-DoWEcNrm.js";import"./ListItemText-CJKnCLsZ.js";import"./LinkButton-PBhijShz.js";import"./Link-CMqafiV1.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-arrMMvmZ.js";import"./Divider-C5hfIyuI.js";import"./CardActions-CtZbu5K_.js";import"./BottomLink-DlULM6Ak.js";import"./ArrowForward-BIypQajv.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
