import{j as o}from"./iframe-D1GFiJZo.js";import{c as e}from"./plugin-CKgXZTOa.js";import{S as l}from"./Grid-C_DJ7CXy.js";import{C as m}from"./ComponentAccordion-BtV82IyJ.js";import{w as a}from"./appWrappers-DsMAuWKH.js";import{T as i}from"./TemplateBackstageLogoIcon-C_U7H0hP.js";import{I as s}from"./InfoCard-DNXQeFaq.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DzFxQMSf.js";import"./componentData-B3mVAfsp.js";import"./useAnalytics-CoSsSvYs.js";import"./useApp-DQ-5E_lb.js";import"./useRouteRef-DO_E-PIP.js";import"./index-DKQ8ROEi.js";import"./DialogTitle-BrPPzfXC.js";import"./Modal-Cfmtm0OK.js";import"./Portal-B8zTs1MC.js";import"./Backdrop-ClAhZkYO.js";import"./Button-DZDIOJUc.js";import"./useObservable-mQQsnksj.js";import"./useIsomorphicLayoutEffect-C1EkHGJN.js";import"./ExpandMore-C5Qt4VBZ.js";import"./AccordionDetails-CHtH84ap.js";import"./index-DnL3XN75.js";import"./Collapse-DDq3EAkH.js";import"./useAsync-B9mAtbAn.js";import"./useMountedState-qz1JMqOw.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-CDDk_fHy.js";import"./ErrorBoundary-BGnIfumD.js";import"./ErrorPanel-DW_UBsf7.js";import"./WarningPanel-Cp7h97Xz.js";import"./MarkdownContent-B_nTIlyA.js";import"./CodeSnippet-C5RtD8fm.js";import"./Box-_YREnRyM.js";import"./styled-CDUeIV7m.js";import"./CopyTextButton-p_Y8WBTg.js";import"./useCopyToClipboard-BYpPSSth.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";import"./List-kH2EmDt_.js";import"./ListContext-BZJs2wbx.js";import"./ListItem-DWHRsh5J.js";import"./ListItemText-ioovX8R3.js";import"./LinkButton-CABNA6l3.js";import"./Link-B1KKwcLj.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-HwFA-nax.js";import"./Divider-CCA28OD_.js";import"./CardActions-BH1q8i_s.js";import"./BottomLink-BFyTmqMM.js";import"./ArrowForward-DKYzAO2n.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
