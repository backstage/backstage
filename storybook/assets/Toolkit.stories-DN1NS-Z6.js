import{j as o}from"./iframe-DpqnIERb.js";import{c as e}from"./plugin-Cx3M3zXy.js";import{S as l}from"./Grid-ByES49Fm.js";import{C as m}from"./ComponentAccordion-CVMhwwQY.js";import{w as a}from"./appWrappers-DtX5QIpn.js";import{T as i}from"./TemplateBackstageLogoIcon-DsDF5jOa.js";import{I as s}from"./InfoCard-DIeyI-8u.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BwzRXZkr.js";import"./componentData-Bjp7AxYA.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./useRouteRef-Do6k1rAi.js";import"./index-DoyRYStT.js";import"./DialogTitle--5D8qIle.js";import"./Modal-DsN87qYK.js";import"./Portal-BmmQaE8x.js";import"./Backdrop-BRjIVZ8-.js";import"./Button-CVkCSpbG.js";import"./useObservable-BoxxXUWC.js";import"./useIsomorphicLayoutEffect-7TzPryCL.js";import"./ExpandMore-BgvB3-yb.js";import"./AccordionDetails-Bu4VHsDj.js";import"./index-B9sM2jn7.js";import"./Collapse-BXZ4KKDG.js";import"./useAsync-DJIduLQY.js";import"./useMountedState-5johZ_Rp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-B6Jpg0qe.js";import"./ErrorBoundary-Dt-Pq3d7.js";import"./ErrorPanel-9MxiIPAH.js";import"./WarningPanel-4qyRcOUk.js";import"./MarkdownContent-C_B0rjEe.js";import"./CodeSnippet-BZN7CHRt.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./CopyTextButton-BZ1rpe7z.js";import"./useCopyToClipboard-DxpZSgA2.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";import"./List-CZbmWexd.js";import"./ListContext-BxawfRoI.js";import"./ListItem-D0Z8ElGo.js";import"./ListItemText-DoVLQ6VK.js";import"./LinkButton-ImbjNSpo.js";import"./Link-CYlpUQKG.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-BeO5U3X8.js";import"./Divider-BjLL1Xub.js";import"./CardActions-B9E1ejZA.js";import"./BottomLink-InnL8-4N.js";import"./ArrowForward-BUxo812p.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
