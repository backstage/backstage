import{j as o}from"./iframe-DEXNC9RX.js";import{c as e}from"./plugin-CLlU_Cp6.js";import{S as l}from"./Grid-DwntcsAr.js";import{C as m}from"./ComponentAccordion-CgDhMhtz.js";import{w as a}from"./appWrappers-ZgtTfHmd.js";import{T as i}from"./TemplateBackstageLogoIcon-BRhl5_t_.js";import{I as s}from"./InfoCard-BW4VKxa5.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C9BoD7po.js";import"./componentData-CWUzWtHA.js";import"./useAnalytics-DzYvNwaC.js";import"./useApp-CPRzbwsy.js";import"./useRouteRef-ZxZLNpb-.js";import"./index-BlCxWptt.js";import"./DialogTitle-Cdw2QC1n.js";import"./Modal-qxnLeQlM.js";import"./Portal-O6zOHTQ9.js";import"./Backdrop-DWlQwWtV.js";import"./Button-F3mebnqD.js";import"./useObservable-pijbHhQ1.js";import"./useIsomorphicLayoutEffect-RgkXVcsu.js";import"./ExpandMore-Df24YjII.js";import"./AccordionDetails-K4eNqGeL.js";import"./index-B9sM2jn7.js";import"./Collapse-DklbiL-j.js";import"./useAsync-BAn5CjI7.js";import"./useMountedState-DIp_Aeij.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Dv0KIfNv.js";import"./ErrorBoundary-BM8aEPeZ.js";import"./ErrorPanel-NRnP58h1.js";import"./WarningPanel-C7DL1AdG.js";import"./MarkdownContent-yMYvzVpl.js";import"./CodeSnippet-D4GvPAYc.js";import"./Box-BngrI2dT.js";import"./styled-B4iJQM5t.js";import"./CopyTextButton-DdSDl_l7.js";import"./useCopyToClipboard-DLmeDm8w.js";import"./Tooltip-B5JVDv03.js";import"./Popper-Dtp4XQPR.js";import"./List-861P7w9f.js";import"./ListContext-CuQ6sOnh.js";import"./ListItem-BsFeXcoa.js";import"./ListItemText-SZBW9x2i.js";import"./LinkButton-CVg2ID4w.js";import"./Link-7jnzHmir.js";import"./lodash-Czox7iJy.js";import"./CardHeader-D25g89XU.js";import"./Divider-DNnZbvf9.js";import"./CardActions-BRmKXnBD.js";import"./BottomLink-Bps-KGLO.js";import"./ArrowForward-epoaBmEz.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
