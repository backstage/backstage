import{j as t,m as u,I as p,b as g,T as h}from"./iframe-Vo5gUnCl.js";import{r as x}from"./plugin-CJ0pvb_3.js";import{S as l,u as c,a as S}from"./useSearchModal-DGv_9PRz.js";import{B as m}from"./Button-Cn1hZ8HW.js";import{a as M,b as C,c as f}from"./DialogTitle-BVpOivUt.js";import{B as j}from"./Box-DxK1aAZk.js";import{S as n}from"./Grid-BEftOOde.js";import{S as y}from"./SearchType-b50w-Eu_.js";import{L as I}from"./List-DaH1cfBf.js";import{H as B}from"./DefaultResultListItem-CG7Dta33.js";import{s as D,M as G}from"./api-BpxwBz3U.js";import{S as R}from"./SearchContext-BnMDvh_6.js";import{w as T}from"./appWrappers-DRnMogOg.js";import{SearchBar as k}from"./SearchBar-Co84ttFI.js";import{a as v}from"./SearchResult-D6R9xMlT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0teuKbX.js";import"./Plugin-BR2getLG.js";import"./componentData-CM3E1gm5.js";import"./useAnalytics-DHo0n9fb.js";import"./useApp-ByJEk4p0.js";import"./useRouteRef-P8yf-IQ-.js";import"./index-CkzVBa0W.js";import"./ArrowForward-0a0C5lHr.js";import"./translation-BgY6CElg.js";import"./Page-HYVvTWMM.js";import"./useMediaQuery-CCtAi1l2.js";import"./Divider-CM863GtP.js";import"./ArrowBackIos-C7G6Qwat.js";import"./ArrowForwardIos-CPwOoImG.js";import"./translation-CafHGIzb.js";import"./Modal-Ccymkcf6.js";import"./Portal-D4JBSn9P.js";import"./Backdrop-tN9AW69-.js";import"./styled-DKP2AsJk.js";import"./ExpandMore-D0AdZzXp.js";import"./useAsync-DeuSsByy.js";import"./useMountedState-Bh-KE1Jd.js";import"./AccordionDetails-7QWkCXyJ.js";import"./index-B9sM2jn7.js";import"./Collapse-UgyrRMk3.js";import"./ListItem-C_bA5RtL.js";import"./ListContext-CeAVa15U.js";import"./ListItemIcon-CR7p7Wnw.js";import"./ListItemText-DwHyTgsb.js";import"./Tabs-D3M7J3bI.js";import"./KeyboardArrowRight-DyNS_sAC.js";import"./FormLabel-OMJSE2YA.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CAmlKy5c.js";import"./InputLabel-Be2YX9nc.js";import"./Select-CsujrQ2q.js";import"./Popover-S-Yp5OBg.js";import"./MenuItem-Bjzie91c.js";import"./Checkbox-D094__4G.js";import"./SwitchBase-iZHA9-E5.js";import"./Chip-Z-yXTvm5.js";import"./Link-C_eXFj6m.js";import"./lodash-Czox7iJy.js";import"./useObservable-Cde_jjGr.js";import"./useIsomorphicLayoutEffect-DzFgYOQ-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-zTM8pi5B.js";import"./useDebounce-CBYZk7U8.js";import"./InputAdornment-CVt48U_9.js";import"./TextField-B_k9BPFC.js";import"./useElementFilter-BfVWtzvH.js";import"./EmptyState-zLePTDUA.js";import"./Progress-sgfxDU-0.js";import"./LinearProgress-C17trEio.js";import"./ResponseErrorPanel-C0NrlyuG.js";import"./ErrorPanel-CECY8d1j.js";import"./WarningPanel-3Yi5HVAk.js";import"./MarkdownContent-C2NiFE4k.js";import"./CodeSnippet-D6VjBC0k.js";import"./CopyTextButton-3h_uNDP1.js";import"./useCopyToClipboard-D18fnjgX.js";import"./Tooltip-CrljWSzR.js";import"./Popper-xVSLGgcC.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
