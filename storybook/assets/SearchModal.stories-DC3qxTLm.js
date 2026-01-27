import{j as t,m as u,I as p,b as g,T as h}from"./iframe-je00FURG.js";import{r as x}from"./plugin-CyJezcXd.js";import{S as l,u as c,a as S}from"./useSearchModal--i27aAMe.js";import{B as m}from"./Button-e9i6ecRO.js";import{a as M,b as C,c as f}from"./DialogTitle-BrutmU8s.js";import{B as j}from"./Box-D5OPEor2.js";import{S as n}from"./Grid-B0PQ6h2h.js";import{S as y}from"./SearchType-bn8O9urf.js";import{L as I}from"./List-DQRaF7f8.js";import{H as B}from"./DefaultResultListItem-Dd4-XeoM.js";import{s as D,M as G}from"./api-CTqZeyiG.js";import{S as R}from"./SearchContext-DXd8kd2R.js";import{w as T}from"./appWrappers-By_Q_AL8.js";import{SearchBar as k}from"./SearchBar-B0RhhPkB.js";import{a as v}from"./SearchResult-CbRtDrmQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BM9kPEWO.js";import"./Plugin-DoNM7ZpW.js";import"./componentData-B0x1fgMY.js";import"./useAnalytics-B71HiL1G.js";import"./useApp-CoQBQg-r.js";import"./useRouteRef-Cd63Ir6Y.js";import"./index-B0djXPeI.js";import"./ArrowForward-D3Ap_tna.js";import"./translation-CTA2-dOi.js";import"./Page-BMiGw85f.js";import"./useMediaQuery-Cy-U4TLC.js";import"./Divider-CEZbmPKt.js";import"./ArrowBackIos-BQz0mEUb.js";import"./ArrowForwardIos-D-yMzG5N.js";import"./translation-DxFueToX.js";import"./Modal-CCp-xvQI.js";import"./Portal-CNYY4S2y.js";import"./Backdrop-Dfj-Yr1w.js";import"./styled-xFV0esG7.js";import"./ExpandMore-WI6HnxKN.js";import"./useAsync-B7wjwiMu.js";import"./useMountedState-BIjkbirw.js";import"./AccordionDetails-D7NCYtPs.js";import"./index-B9sM2jn7.js";import"./Collapse-C_uADL9y.js";import"./ListItem-DfuXVJU9.js";import"./ListContext-CO6-aiX7.js";import"./ListItemIcon-fTltLVZs.js";import"./ListItemText-CIKD7UvW.js";import"./Tabs-CACgS8hA.js";import"./KeyboardArrowRight-oYb6GZWc.js";import"./FormLabel-Cx_pZ6vy.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CG8S2Kz4.js";import"./InputLabel-D9736dnF.js";import"./Select-oKwXQTGq.js";import"./Popover-oZeBTllV.js";import"./MenuItem-DXRyX6Ux.js";import"./Checkbox-DPl_nk4n.js";import"./SwitchBase-BN3xNYxz.js";import"./Chip-efxXjGdb.js";import"./Link-rQVMVaTb.js";import"./lodash-Czox7iJy.js";import"./useObservable-CN0oJJvE.js";import"./useIsomorphicLayoutEffect-DlHyn2wM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Bqial9fZ.js";import"./useDebounce-BL9e2XkG.js";import"./InputAdornment-CGXE9Jhs.js";import"./TextField-2RYbBL_c.js";import"./useElementFilter-B4IO5a2a.js";import"./EmptyState-C2n54NMz.js";import"./Progress-Cy6iLLPZ.js";import"./LinearProgress-dpLX1mix.js";import"./ResponseErrorPanel-BNUaaLwE.js";import"./ErrorPanel-D9kr6r3A.js";import"./WarningPanel-Dcuu5cbX.js";import"./MarkdownContent-DkENAc60.js";import"./CodeSnippet-Ctc7NF_9.js";import"./CopyTextButton-CsqW7A3R.js";import"./useCopyToClipboard--lbvSauh.js";import"./Tooltip-D5bghJxt.js";import"./Popper-C-tdByCl.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
