import{j as t,W as u,K as p,X as g}from"./iframe--eVtoH1I.js";import{r as h}from"./plugin-C3hlq2kF.js";import{S as l,u as c,a as x}from"./useSearchModal-B6VLN8tg.js";import{s as S,M}from"./api-DZYXRl_N.js";import{S as C}from"./SearchContext-DYlOyC5b.js";import{B as m}from"./Button-DoStUTVe.js";import{m as f}from"./makeStyles-qwoBpcZQ.js";import{D as j,a as y,b as B}from"./DialogTitle-B9dUhg1b.js";import{B as D}from"./Box-AxOQv2ZW.js";import{S as n}from"./Grid-BxPVFZFG.js";import{S as I}from"./SearchType-oPYcTuFx.js";import{L as G}from"./List-erwGNY81.js";import{H as R}from"./DefaultResultListItem-Do0U8Bjh.js";import{w as k}from"./appWrappers-v3G2RnN5.js";import{SearchBar as v}from"./SearchBar-1mp1VpzP.js";import{S as T}from"./SearchResult-DujCgPfo.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_OsnhVB.js";import"./Plugin-BPrnFIEk.js";import"./componentData-ap8ACm6K.js";import"./useAnalytics-BkWkZjko.js";import"./useApp-Br_-UhXC.js";import"./useRouteRef-BhBB06Ir.js";import"./index-btJptzr1.js";import"./ArrowForward-DIPbMVvP.js";import"./translation-CkLdw3tW.js";import"./Page-CGgwuHrw.js";import"./useMediaQuery-CVynZ5vv.js";import"./Divider-CMMgfVe7.js";import"./ArrowBackIos-DKUavksy.js";import"./ArrowForwardIos-c7YsVP4f.js";import"./translation-DaUCzIbx.js";import"./lodash-CSJy54S8.js";import"./useAsync-DFhVL4JZ.js";import"./useMountedState-BJxTErpD.js";import"./Modal-KRqUqHvk.js";import"./Portal-Cqdnd4y_.js";import"./Backdrop-lUbkaD4O.js";import"./styled-BNUMKqxB.js";import"./ExpandMore-Dj8ixIgf.js";import"./AccordionDetails-Dwi-Tbu2.js";import"./index-B9sM2jn7.js";import"./Collapse-DZhtlU8B.js";import"./ListItem-BKyGWKlr.js";import"./ListContext-Dy_vV088.js";import"./ListItemIcon-EHtW5Q3e.js";import"./ListItemText-Dvl5ZL1u.js";import"./Tabs-2kDLiiw2.js";import"./KeyboardArrowRight-D4KEIBKS.js";import"./FormLabel-B5zN99Ip.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cchc_mew.js";import"./InputLabel-cARoGg0v.js";import"./Select-DsvmoJmP.js";import"./Popover-Csu5u7SS.js";import"./MenuItem-CIKhFgDz.js";import"./Checkbox-DB0LXZDI.js";import"./SwitchBase-CkZl22Sk.js";import"./Chip-DuJ1JIPT.js";import"./Link-BAdxSWkK.js";import"./index-Dqb3Scx7.js";import"./useObservable-DePp3QoV.js";import"./useIsomorphicLayoutEffect-BBXBH1QW.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BwtnGImO.js";import"./useDebounce-CGhatMJ8.js";import"./InputAdornment-BSgHvUY5.js";import"./TextField-B_KzoZw0.js";import"./useElementFilter-FD9QnvM0.js";import"./EmptyState-D83YIrPR.js";import"./Progress-B1gp1hca.js";import"./LinearProgress-DpRqYiJt.js";import"./ResponseErrorPanel-xJoRFMoI.js";import"./ErrorPanel-Cd-XmSSh.js";import"./WarningPanel-CMvz4y_g.js";import"./MarkdownContent-CYgDtkzo.js";import"./CodeSnippet-C8435I_3.js";import"./CopyTextButton-Bwnn4YZT.js";import"./useCopyToClipboard-CD7ySspH.js";import"./Tooltip-Ckjn1o_Q.js";import"./Popper-C6VLYrWu.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
