import{j as t,W as u,K as p,X as g}from"./iframe-C97aGyUm.js";import{r as h}from"./plugin-CG7QGOnm.js";import{S as l,u as c,a as x}from"./useSearchModal-B1KDQG3w.js";import{s as S,M}from"./api-D18Ri3Jk.js";import{S as C}from"./SearchContext-CfJy0MCQ.js";import{B as m}from"./Button-Cf28NAjI.js";import{m as f}from"./makeStyles-BH_X-duW.js";import{D as j,a as y,b as B}from"./DialogTitle-Cpm7w2ps.js";import{B as D}from"./Box-Df-ATJWc.js";import{S as n}from"./Grid-B4D-XE5H.js";import{S as I}from"./SearchType-C_F3ggcE.js";import{L as G}from"./List-BpxYOW0_.js";import{H as R}from"./DefaultResultListItem-DPDg8cu6.js";import{w as k}from"./appWrappers-Dd-MH2a_.js";import{SearchBar as v}from"./SearchBar-Bwh-xJZY.js";import{S as T}from"./SearchResult-B_V-6Adk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CDQsu88N.js";import"./Plugin-l4PHB1DA.js";import"./componentData-B-ZbE2mU.js";import"./useAnalytics-CPFwZTkm.js";import"./useApp-CJrMf8iL.js";import"./useRouteRef-CUFWN4wa.js";import"./index-D3xivPOe.js";import"./ArrowForward-7ktp-50g.js";import"./translation-BtLCvFjX.js";import"./Page-Dnzw6I_N.js";import"./useMediaQuery-CQ4eyRKM.js";import"./Divider-DR_-bkrG.js";import"./ArrowBackIos-xxzMfAwm.js";import"./ArrowForwardIos-CkpP7uQg.js";import"./translation-B748gYKb.js";import"./lodash-CjTo-pxC.js";import"./useAsync-BN-pPxxA.js";import"./useMountedState-DKTKiVGI.js";import"./Modal-Bz25sGJi.js";import"./Portal-CFNjbNqg.js";import"./Backdrop-BRt2z0sU.js";import"./styled-BJz5j31a.js";import"./ExpandMore-DQnFi8wU.js";import"./AccordionDetails-RttftoEk.js";import"./index-B9sM2jn7.js";import"./Collapse-DCaCKP1G.js";import"./ListItem-wmZ5BRVq.js";import"./ListContext-CrpBZA7K.js";import"./ListItemIcon-D_ltdA2D.js";import"./ListItemText-DUwIkaVM.js";import"./Tabs-jXvWs8Ra.js";import"./KeyboardArrowRight-BTJe9c1b.js";import"./FormLabel-CMdG7IgC.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-HbRl03P6.js";import"./InputLabel-DmSvX0M1.js";import"./Select-Dh_D7-6F.js";import"./Popover-C1p9-1lq.js";import"./MenuItem-39BCzQ5Q.js";import"./Checkbox-BECvhfxW.js";import"./SwitchBase-BxLOqkbm.js";import"./Chip-BUnYrFS-.js";import"./Link-CtyWu2T9.js";import"./index-J5_UG62z.js";import"./useObservable-BsTkKb7r.js";import"./useIsomorphicLayoutEffect-JRtGOS2E.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DxU1ySun.js";import"./useDebounce-BEhLJEQk.js";import"./InputAdornment-CgsrUjWW.js";import"./TextField-CZy_QrRZ.js";import"./useElementFilter-olm-yqik.js";import"./EmptyState-ClznzCiH.js";import"./Progress-DqyK2_Qp.js";import"./LinearProgress-CgVfPbhq.js";import"./ResponseErrorPanel-BY4ksVyl.js";import"./ErrorPanel-27WlqtRg.js";import"./WarningPanel-vJ5ed0Y4.js";import"./MarkdownContent-CHjXC1sw.js";import"./CodeSnippet-BHzVYurR.js";import"./CopyTextButton-B2KMIwjA.js";import"./useCopyToClipboard-DupPQQh1.js";import"./Tooltip-BGk1OQyx.js";import"./Popper-B9Uqg6K1.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
