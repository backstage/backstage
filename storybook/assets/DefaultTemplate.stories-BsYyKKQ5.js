import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-CJzL4cPn.js";import{s as g,H as u}from"./plugin-D2nWyMkh.js";import{c as h}from"./api-DGE4Qh0m.js";import{c as f}from"./catalogApiMock-BDZRCWBF.js";import{s as x}from"./api-D6FmelBo.js";import{S as y}from"./SearchContext-DohUNuhv.js";import{P as S}from"./Page-B9HPUsP-.js";import{S as r}from"./Grid-BQVDj5Jb.js";import{b as k,a as j,c as C}from"./plugin-Bw2JxBRJ.js";import{T as P}from"./TemplateBackstageLogo-CZu6ZdNf.js";import{T}from"./TemplateBackstageLogoIcon-DGAifk9M.js";import{e as I}from"./routes-Cq1zNHUw.js";import{w as v}from"./appWrappers-t7jUGClR.js";import{s as G}from"./StarredEntitiesApi-CKm3IY79.js";import{M as A}from"./MockStarredEntitiesApi-DV45ZQ4j.js";import{I as B}from"./InfoCard-s6oTMLKo.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CzvWtn5D.js";import"./Plugin-T9LhbTpw.js";import"./componentData-Bxo0opjl.js";import"./useAnalytics-BPOXrxOI.js";import"./useApp-B-72fomi.js";import"./useRouteRef-C2SQIqLl.js";import"./index-DOHES8EM.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-BSNRfxTI.js";import"./useMountedState-B45YxSq3.js";import"./DialogTitle-CVZcsTa6.js";import"./Modal-1aP5x17K.js";import"./Portal-ySyRj64n.js";import"./Backdrop-gfzpOR42.js";import"./Button-BDjrXKRV.js";import"./useObservable-CavGCRyy.js";import"./useIsomorphicLayoutEffect-CudT8Pcz.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-dYVvKObS.js";import"./ErrorBoundary-DBk-iV9m.js";import"./ErrorPanel-GfXZ_B1c.js";import"./WarningPanel-BI6WRQPV.js";import"./ExpandMore-CmjptgVe.js";import"./AccordionDetails-BotIVLWW.js";import"./index-DnL3XN75.js";import"./Collapse-DsMTKxQW.js";import"./MarkdownContent-C8HtueuI.js";import"./CodeSnippet-CXtB-eI-.js";import"./Box-Csalpl_F.js";import"./styled-f8cp2BHL.js";import"./CopyTextButton-CsNMp3PI.js";import"./useCopyToClipboard-PlMsdEl8.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";import"./List-BYbAdUIJ.js";import"./ListContext-BHz-Qyxa.js";import"./ListItem-KhwlQec0.js";import"./ListItemText-B_NH5e14.js";import"./LinkButton-UtNdPjxK.js";import"./Link-bUQVVVBw.js";import"./CardHeader-CmXARScs.js";import"./Divider-BE8z6uet.js";import"./CardActions-DiO9K5sf.js";import"./BottomLink-BModPU04.js";import"./ArrowForward-Z4Kc94IP.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
