import{j as o}from"./iframe-hd6BgcQH.js";import{c as e}from"./plugin-92FY2VfE.js";import{S as l}from"./Grid-C4Dm4yGa.js";import{C as m}from"./ComponentAccordion-DJ_8JENk.js";import{w as a}from"./appWrappers-Ci8V8MLf.js";import{T as i}from"./TemplateBackstageLogoIcon-u-sWuj8x.js";import{I as s}from"./InfoCard-DXQ7_Apb.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-iM4X_t4D.js";import"./componentData-Cp5cye-b.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./useRouteRef-BFQKnc9G.js";import"./index-BvioCNb0.js";import"./DialogTitle-BJGjv1lD.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./Backdrop-TGnaLO6W.js";import"./Button-3MbgNa_D.js";import"./useObservable-C2Ift1hU.js";import"./ExpandMore-C7-67hd9.js";import"./AccordionDetails-DosuP5Ed.js";import"./index-DnL3XN75.js";import"./Collapse-D-UdipB4.js";import"./useAsync-DlvFpJJJ.js";import"./useMountedState-BwuO-QSl.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Da9FNRpD.js";import"./ErrorBoundary-BxDyxJNA.js";import"./ErrorPanel-pwFCh6zc.js";import"./WarningPanel-Le2tKfrN.js";import"./MarkdownContent-aZlBpoZT.js";import"./CodeSnippet-BlQm8FHA.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./CopyTextButton-C8AIAO8L.js";import"./useCopyToClipboard-ZIjVTeCY.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./ListItem-BuICECdF.js";import"./ListItemText-B0MXj_oA.js";import"./LinkButton-DUOFEHwI.js";import"./Link-DIsoXdRS.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-ChJbkXh1.js";import"./Divider-BsrVsHFl.js";import"./CardActions-Ci4WOTdw.js";import"./BottomLink-BlsHV6Ti.js";import"./ArrowForward-Bdq2LjKG.js";const so={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const co=["Default","InAccordion"];export{r as Default,t as InAccordion,co as __namedExportsOrder,so as default};
