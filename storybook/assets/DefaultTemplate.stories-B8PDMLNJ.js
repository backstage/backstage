import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-C773ayyW.js";import{s as g,H as u}from"./plugin-DPT5L4ox.js";import{c as h}from"./api-CfglKS02.js";import{c as f}from"./catalogApiMock-DfecX1Qz.js";import{s as x}from"./api-CDEXucDH.js";import{S as y}from"./SearchContext-BgnwhBSz.js";import{P as S}from"./Page-DmA_gFK6.js";import{S as r}from"./Grid-oO_1iSro.js";import{b as k,a as j,c as C}from"./plugin-gEzBmSkr.js";import{T as P}from"./TemplateBackstageLogo-OZ6NC9oH.js";import{T}from"./TemplateBackstageLogoIcon-BwyozfwT.js";import{e as I}from"./routes-cPfQklBb.js";import{w as v}from"./appWrappers-DrF6lruE.js";import{s as G}from"./StarredEntitiesApi-D0cugF7v.js";import{M as A}from"./MockStarredEntitiesApi-DtoE5pVQ.js";import{I as B}from"./InfoCard-DpchVZYW.js";import"./preload-helper-D9Z9MdNV.js";import"./index-ilx6tCZY.js";import"./Plugin-DgheCK0L.js";import"./componentData-Bdgmno7t.js";import"./useAnalytics-BUXUfjUP.js";import"./useApp-p5rHYLk0.js";import"./useRouteRef-BO68tLin.js";import"./index-B7-NdQX-.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-Dnv3cfj8.js";import"./useMountedState-BaRlQShP.js";import"./DialogTitle-C7AhKUgT.js";import"./Modal-t1QUaF78.js";import"./Portal-CQJvHB_7.js";import"./Backdrop-CZK56ZrR.js";import"./Button-gX2CQaIh.js";import"./useObservable-BD2eLMSd.js";import"./useIsomorphicLayoutEffect-fSTRkWZD.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-0uyrcITt.js";import"./ErrorBoundary-84N5Onnv.js";import"./ErrorPanel-DHXJzEMk.js";import"./WarningPanel-CSA5ach2.js";import"./ExpandMore-Dc64qUSO.js";import"./AccordionDetails-CDPX87gH.js";import"./index-DnL3XN75.js";import"./Collapse-CHxej2af.js";import"./MarkdownContent-ebJNHJdy.js";import"./CodeSnippet-C_E6kwNC.js";import"./Box-c_uSXZkq.js";import"./styled-EjF9N2BZ.js";import"./CopyTextButton-DKZ84MGL.js";import"./useCopyToClipboard-CtMXT3me.js";import"./Tooltip-BuBe4fE-.js";import"./Popper-C-ZRE_0u.js";import"./List-BAYQ25-v.js";import"./ListContext-BwXeXg0F.js";import"./ListItem-ByJ_H4o2.js";import"./ListItemText-DjaDs-4M.js";import"./LinkButton-BhVCLyOG.js";import"./Link-88zF7xCS.js";import"./CardHeader-BR9PWCtj.js";import"./Divider-DsftiJpK.js";import"./CardActions-BW9rpFHQ.js";import"./BottomLink-C-ywMqKi.js";import"./ArrowForward-DJtOLu8h.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
