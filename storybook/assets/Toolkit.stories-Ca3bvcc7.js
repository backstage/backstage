import{j as o}from"./iframe-D-w6RxGv.js";import{c as e}from"./plugin-DpTs2s3G.js";import{S as l}from"./Grid-Dts7GzWa.js";import{C as m}from"./ComponentAccordion-BGWhredK.js";import{w as a}from"./appWrappers-BDndsqAl.js";import{T as i}from"./TemplateBackstageLogoIcon-DuIGNG5E.js";import{I as s}from"./InfoCard-9JWpIulp.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CWxA29pF.js";import"./componentData-BrNCABFb.js";import"./useAnalytics-DPlXbgxY.js";import"./useApp-CFgLl9KI.js";import"./useRouteRef-DKWFMIlX.js";import"./index-BY4RoNki.js";import"./DialogTitle-D3Q4uAmB.js";import"./Modal-Ds0hJkbL.js";import"./Portal-DWcyIRvv.js";import"./Backdrop-D0MNdkqU.js";import"./Button-BFjkR3wc.js";import"./useObservable-CKEb6xrB.js";import"./useIsomorphicLayoutEffect-BdbRXj_e.js";import"./ExpandMore-BTmXorSC.js";import"./AccordionDetails-B5XR2THz.js";import"./index-DnL3XN75.js";import"./Collapse-efa4O20L.js";import"./useAsync-BGWO1dGB.js";import"./useMountedState-CFUXa8RM.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Daj9kNFa.js";import"./ErrorBoundary-DBPwAXOm.js";import"./ErrorPanel-BqOBprFq.js";import"./WarningPanel-8DIVHb20.js";import"./MarkdownContent---Ocrjn1.js";import"./CodeSnippet-CVxT4o4G.js";import"./Box-PhnhPtmh.js";import"./styled-n-xY2yaY.js";import"./CopyTextButton-CDPhBR-t.js";import"./useCopyToClipboard-D_vXHP6Q.js";import"./Tooltip-D4tR_jXC.js";import"./Popper-Dx-ZWhUD.js";import"./List-CujjVc52.js";import"./ListContext-yRQd_P0Y.js";import"./ListItem-DC_Q_Qo-.js";import"./ListItemText-SKgMyQts.js";import"./LinkButton-cpdTg8QR.js";import"./Link-Dhe_VRcU.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BkE3ViQm.js";import"./Divider-CtO0jY8z.js";import"./CardActions-BCtx-_t5.js";import"./BottomLink-mVcObROK.js";import"./ArrowForward-D69vUWDI.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
