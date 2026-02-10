import{j as o}from"./iframe-DA79yDb5.js";import{c as e}from"./plugin-DPO0j2JD.js";import{S as l}from"./Grid-BPnxYFEE.js";import{C as m}from"./ComponentAccordion-DcctrLHm.js";import{w as a}from"./appWrappers-n6jVhqF6.js";import{T as i}from"./TemplateBackstageLogoIcon-aRlfPf9z.js";import{I as s}from"./InfoCard-DXBo22iI.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CYrkOIGL.js";import"./componentData-Cd7zESh7.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./useRouteRef-Vppi1dhZ.js";import"./index-Yr_6lw0r.js";import"./DialogTitle-Cam7H8C2.js";import"./Modal-B60MXtNN.js";import"./Portal-C0jNS9Vb.js";import"./Backdrop-CHWN49VN.js";import"./Button-DhPtekNk.js";import"./useObservable-C8gw3qun.js";import"./useIsomorphicLayoutEffect-Bv5BjMnP.js";import"./ExpandMore-DR_zyoTC.js";import"./AccordionDetails-BvhTDe-h.js";import"./index-B9sM2jn7.js";import"./Collapse-Cl5eVhLP.js";import"./useAsync-DJl5sWtJ.js";import"./useMountedState-3oFHoVCv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DSz4cfwc.js";import"./ErrorBoundary-D_GuCvAD.js";import"./ErrorPanel-Cep-pimB.js";import"./WarningPanel-BYActx0S.js";import"./MarkdownContent-GLKDok0W.js";import"./CodeSnippet-CVIRDvuJ.js";import"./Box-BVQ5Vy1y.js";import"./styled-BjxYaA7M.js";import"./CopyTextButton-BbvOylv0.js";import"./useCopyToClipboard-BnMS7Zdt.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";import"./List-nEGPw4NA.js";import"./ListContext-kCBY5dMI.js";import"./ListItem-BvihMH8Z.js";import"./ListItemText-DGxuZd8I.js";import"./LinkButton-C7Vx68WK.js";import"./Link-QsBbL45G.js";import"./lodash-DGzVoyEp.js";import"./CardHeader-BBlm1V9W.js";import"./Divider-CFY8fi3w.js";import"./CardActions-C6lGtMc4.js";import"./BottomLink-Bj6NYPog.js";import"./ArrowForward-2Mv1uxa3.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
