import{j as o}from"./iframe-CJzL4cPn.js";import{c as e}from"./plugin-Bw2JxBRJ.js";import{S as l}from"./Grid-BQVDj5Jb.js";import{C as m}from"./ComponentAccordion-Dw2A64CM.js";import{w as a}from"./appWrappers-t7jUGClR.js";import{T as i}from"./TemplateBackstageLogoIcon-DGAifk9M.js";import{I as s}from"./InfoCard-s6oTMLKo.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-T9LhbTpw.js";import"./componentData-Bxo0opjl.js";import"./useAnalytics-BPOXrxOI.js";import"./useApp-B-72fomi.js";import"./useRouteRef-C2SQIqLl.js";import"./index-DOHES8EM.js";import"./DialogTitle-CVZcsTa6.js";import"./Modal-1aP5x17K.js";import"./Portal-ySyRj64n.js";import"./Backdrop-gfzpOR42.js";import"./Button-BDjrXKRV.js";import"./useObservable-CavGCRyy.js";import"./useIsomorphicLayoutEffect-CudT8Pcz.js";import"./ExpandMore-CmjptgVe.js";import"./AccordionDetails-BotIVLWW.js";import"./index-DnL3XN75.js";import"./Collapse-DsMTKxQW.js";import"./useAsync-BSNRfxTI.js";import"./useMountedState-B45YxSq3.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-dYVvKObS.js";import"./ErrorBoundary-DBk-iV9m.js";import"./ErrorPanel-GfXZ_B1c.js";import"./WarningPanel-BI6WRQPV.js";import"./MarkdownContent-C8HtueuI.js";import"./CodeSnippet-CXtB-eI-.js";import"./Box-Csalpl_F.js";import"./styled-f8cp2BHL.js";import"./CopyTextButton-CsNMp3PI.js";import"./useCopyToClipboard-PlMsdEl8.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";import"./List-BYbAdUIJ.js";import"./ListContext-BHz-Qyxa.js";import"./ListItem-KhwlQec0.js";import"./ListItemText-B_NH5e14.js";import"./LinkButton-UtNdPjxK.js";import"./Link-bUQVVVBw.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-CmXARScs.js";import"./Divider-BE8z6uet.js";import"./CardActions-DiO9K5sf.js";import"./BottomLink-BModPU04.js";import"./ArrowForward-Z4Kc94IP.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
