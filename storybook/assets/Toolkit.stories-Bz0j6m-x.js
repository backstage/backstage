import{j as o}from"./iframe-D4YkWMPd.js";import{c as e}from"./plugin-seGdHiiS.js";import{S as l}from"./Grid-3dbGowTG.js";import{C as m}from"./ComponentAccordion-DxolfG6V.js";import{w as a}from"./appWrappers-BdS3ZXd0.js";import{T as i}from"./TemplateBackstageLogoIcon-4IgW3rbm.js";import{I as s}from"./InfoCard-DekS9cui.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CS5_JnCA.js";import"./componentData-C4oKpH_t.js";import"./useAnalytics--ii2Xnv1.js";import"./useApp-BYOY4yJv.js";import"./useRouteRef-Dr-zIQ4_.js";import"./index-Cb5ApCX3.js";import"./DialogTitle-ikIQGFRt.js";import"./Modal-BPzxcCH2.js";import"./Portal-GmGr81qv.js";import"./Backdrop-BWtXXt1T.js";import"./Button-bLTRgJ4c.js";import"./useObservable-DbwS_JUV.js";import"./useIsomorphicLayoutEffect-CKq4zRUd.js";import"./ExpandMore-Bpioo4yy.js";import"./AccordionDetails-DKrusFPL.js";import"./index-DnL3XN75.js";import"./Collapse-CyHojAhw.js";import"./useAsync-DFwDLbfT.js";import"./useMountedState-BZeJdOiH.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-CH-NP11H.js";import"./ErrorBoundary-Dj_BdtLc.js";import"./ErrorPanel-geXzwKYb.js";import"./WarningPanel-CPZUUyuU.js";import"./MarkdownContent-DNug9PDQ.js";import"./CodeSnippet-Dl0gP_YZ.js";import"./Box-CrXhOgBb.js";import"./styled-dYo-GhGI.js";import"./CopyTextButton-GQ6DbX_U.js";import"./useCopyToClipboard-CXAMfyh-.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";import"./List-DbiJVjlG.js";import"./ListContext-C8PRUhDY.js";import"./ListItem-C4617hHA.js";import"./ListItemText-C8w1SX_U.js";import"./LinkButton-bYk9cqtO.js";import"./Link-Cg_HU4j2.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-B1-VM8pp.js";import"./Divider-DoiUQK47.js";import"./CardActions-CBi48CeD.js";import"./BottomLink-Ckmh1WY3.js";import"./ArrowForward-ZRQV-YG0.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
