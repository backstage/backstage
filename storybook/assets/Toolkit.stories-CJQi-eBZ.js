import{j as o}from"./iframe-CjPeRtpr.js";import{c as e}from"./plugin-BFKPDosn.js";import{S as l}from"./Grid-C-Nq5_yH.js";import{C as m}from"./ComponentAccordion-HMaQZfn2.js";import{w as a}from"./appWrappers-C7xvnveN.js";import{T as i}from"./TemplateBackstageLogoIcon-BbKdqs7Q.js";import{I as s}from"./InfoCard-C-EjB3hx.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-By9pZykQ.js";import"./componentData-BESRmA5Y.js";import"./useAnalytics-CKVjVoDQ.js";import"./useApp-BDYwb5CO.js";import"./useRouteRef-aNZDBX5J.js";import"./index-o3KEuSlS.js";import"./DialogTitle-BwKasQ9h.js";import"./Modal-CJx3g85d.js";import"./Portal-DbRgE8W4.js";import"./Backdrop-BucF1-y1.js";import"./Button-BBexx9Xc.js";import"./useObservable-BgsOv5AO.js";import"./useIsomorphicLayoutEffect-DOJbEOhC.js";import"./ExpandMore-Cc9LWRDz.js";import"./AccordionDetails-DEzX30Kp.js";import"./index-DnL3XN75.js";import"./Collapse-CKqt3vm7.js";import"./useAsync-D_X77wsO.js";import"./useMountedState-_t540rGO.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-CEOlXio4.js";import"./ErrorBoundary-BhQ1akLk.js";import"./ErrorPanel-By3NRS2J.js";import"./WarningPanel-qGQeTBaX.js";import"./MarkdownContent-B1Y4fp3A.js";import"./CodeSnippet-BmcxidKZ.js";import"./Box-Clo5S76h.js";import"./styled-HkKxam_j.js";import"./CopyTextButton-pFjOigu_.js";import"./useCopyToClipboard-Cab7YRdZ.js";import"./Tooltip-D2MzRiUK.js";import"./Popper-Daug_pz5.js";import"./List-viPECRg_.js";import"./ListContext-B6QifY9s.js";import"./ListItem-DXifIexk.js";import"./ListItemText-DslgGDwr.js";import"./LinkButton-Cj8Y8NY6.js";import"./Link-C_RbsuLk.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-Dcsx-jhN.js";import"./Divider-CTYbgud9.js";import"./CardActions-lfCrbJSj.js";import"./BottomLink-CulmZeTU.js";import"./ArrowForward-D3dovPjI.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
