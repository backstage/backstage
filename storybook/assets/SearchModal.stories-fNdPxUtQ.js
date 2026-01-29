import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-CJaWlx9k.js";import{r as x}from"./plugin-CB5XIHom.js";import{S as l,u as c,a as S}from"./useSearchModal-4MQ0wiVY.js";import{s as M,M as C}from"./api-B2GOuMSA.js";import{S as f}from"./SearchContext-BsgFsiMu.js";import{B as m}from"./Button-BIo1VJpq.js";import{D as j,a as y,b as B}from"./DialogTitle-Ddd7NJfh.js";import{B as D}from"./Box-C7QC6pzn.js";import{S as n}from"./Grid-CvrlVjPi.js";import{S as I}from"./SearchType-m1NjHqrF.js";import{L as G}from"./List-CG61H5Q6.js";import{H as R}from"./DefaultResultListItem-C8rZX229.js";import{w as k}from"./appWrappers-KXpf8wG0.js";import{SearchBar as v}from"./SearchBar-DiTBXJAn.js";import{S as T}from"./SearchResult-CLpdPzmf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0cKtLFQ.js";import"./Plugin-CYNhPwzU.js";import"./componentData-DJazsba3.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./useRouteRef-DSloxSH6.js";import"./index-BQ0Bm2RY.js";import"./ArrowForward-DYtCoeK4.js";import"./translation-DmRDuyV2.js";import"./Page-DgwF_mPY.js";import"./useMediaQuery-Boxbdgj3.js";import"./Divider-iZOmm7wk.js";import"./ArrowBackIos-B4Dbbnp0.js";import"./ArrowForwardIos-D6hhrPgl.js";import"./translation-CvClunBN.js";import"./lodash-Czox7iJy.js";import"./useAsync-BIkYo0dn.js";import"./useMountedState-BX2n2ffy.js";import"./Modal-DA7gw75D.js";import"./Portal-CCaSbatU.js";import"./Backdrop-Br04yFLt.js";import"./styled-CZ7JF9wM.js";import"./ExpandMore-C8_7pfNC.js";import"./AccordionDetails-rBd-wslk.js";import"./index-B9sM2jn7.js";import"./Collapse-Do9YA9sk.js";import"./ListItem-C89Oh5hh.js";import"./ListContext-BgC5EWvT.js";import"./ListItemIcon-BmFNtgXW.js";import"./ListItemText-DiADD6kG.js";import"./Tabs-Grsv0U0m.js";import"./KeyboardArrowRight-BtPNriK6.js";import"./FormLabel-BEqYHiJN.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-QuigaWzh.js";import"./InputLabel-DMp1RElY.js";import"./Select-DDdsjrAg.js";import"./Popover-4AFqMLPU.js";import"./MenuItem-BUbXv8-4.js";import"./Checkbox-B4BwPUU4.js";import"./SwitchBase-k0EZwJ-6.js";import"./Chip-Bza0H9Yw.js";import"./Link-BT9-PDsb.js";import"./useObservable-Ci9nj0uo.js";import"./useIsomorphicLayoutEffect-DaQ9vgb_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Ca8YyrQM.js";import"./useDebounce-CRFtWfPL.js";import"./InputAdornment-7AhpIQYh.js";import"./TextField-DoeMvY-N.js";import"./useElementFilter-DSV6Qoiw.js";import"./EmptyState-D0hri3Pb.js";import"./Progress-BXhITX5m.js";import"./LinearProgress-C95mcMVy.js";import"./ResponseErrorPanel-S9t2WShH.js";import"./ErrorPanel-B3gEy6QN.js";import"./WarningPanel-Bt3VBM0r.js";import"./MarkdownContent-BbMUo3g_.js";import"./CodeSnippet-7H2Sad9p.js";import"./CopyTextButton-BT4ENnB_.js";import"./useCopyToClipboard-D8QOZa6n.js";import"./Tooltip-BdyP1fjK.js";import"./Popper-D3Zb46nS.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
