import{j as o}from"./iframe-C773ayyW.js";import{c as e}from"./plugin-gEzBmSkr.js";import{S as l}from"./Grid-oO_1iSro.js";import{C as m}from"./ComponentAccordion-C6eLnn4h.js";import{w as a}from"./appWrappers-DrF6lruE.js";import{T as i}from"./TemplateBackstageLogoIcon-BwyozfwT.js";import{I as s}from"./InfoCard-DpchVZYW.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DgheCK0L.js";import"./componentData-Bdgmno7t.js";import"./useAnalytics-BUXUfjUP.js";import"./useApp-p5rHYLk0.js";import"./useRouteRef-BO68tLin.js";import"./index-B7-NdQX-.js";import"./DialogTitle-C7AhKUgT.js";import"./Modal-t1QUaF78.js";import"./Portal-CQJvHB_7.js";import"./Backdrop-CZK56ZrR.js";import"./Button-gX2CQaIh.js";import"./useObservable-BD2eLMSd.js";import"./useIsomorphicLayoutEffect-fSTRkWZD.js";import"./ExpandMore-Dc64qUSO.js";import"./AccordionDetails-CDPX87gH.js";import"./index-DnL3XN75.js";import"./Collapse-CHxej2af.js";import"./useAsync-Dnv3cfj8.js";import"./useMountedState-BaRlQShP.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-0uyrcITt.js";import"./ErrorBoundary-84N5Onnv.js";import"./ErrorPanel-DHXJzEMk.js";import"./WarningPanel-CSA5ach2.js";import"./MarkdownContent-ebJNHJdy.js";import"./CodeSnippet-C_E6kwNC.js";import"./Box-c_uSXZkq.js";import"./styled-EjF9N2BZ.js";import"./CopyTextButton-DKZ84MGL.js";import"./useCopyToClipboard-CtMXT3me.js";import"./Tooltip-BuBe4fE-.js";import"./Popper-C-ZRE_0u.js";import"./List-BAYQ25-v.js";import"./ListContext-BwXeXg0F.js";import"./ListItem-ByJ_H4o2.js";import"./ListItemText-DjaDs-4M.js";import"./LinkButton-BhVCLyOG.js";import"./Link-88zF7xCS.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-BR9PWCtj.js";import"./Divider-DsftiJpK.js";import"./CardActions-BW9rpFHQ.js";import"./BottomLink-C-ywMqKi.js";import"./ArrowForward-DJtOLu8h.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
